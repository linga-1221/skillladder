
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import hashlib

app = FastAPI()

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

@app.post("/register/")
async def register(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    if not all([email, password, role]):
        raise HTTPException(status_code=400, detail="Missing registration fields.")
    users = load_users()
    if any(u["email"] == email for u in users):
        raise HTTPException(status_code=400, detail="User already exists.")
    users.append({"email": email, "password": hash_password(password), "role": role, "history": []})
    save_users(users)
    return {"status": "registered", "email": email, "role": role}

@app.post("/login/")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Missing login fields.")
    users = load_users()
    user = next((u for u in users if u["email"] == email and u["password"] == hash_password(password)), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    return {"status": "success", "email": user["email"], "role": user["role"]}

@app.post("/save_history/")
async def save_history(request: Request):
    data = await request.json()
    email = data.get("email")
    entry = data.get("entry")
    if not email or not entry:
        raise HTTPException(status_code=400, detail="Missing email or entry.")
    users = load_users()
    for u in users:
        if u["email"] == email:
            if "history" not in u:
                u["history"] = []
            u["history"].append(entry)
            save_users(users)
            return {"status": "saved"}
    raise HTTPException(status_code=404, detail="User not found.")

@app.get("/get_history/")
async def get_history(email: str):
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"history": user.get("history", [])}

@app.get("/admin/all_users/")
async def admin_all_users():
    users = load_users()
    return [{"email": u["email"], "role": u["role"], "history": u.get("history", [])} for u in users]

# Interview scheduling (simple demo)
INTERVIEWS_FILE = os.path.join(os.path.dirname(__file__), "interviews.json")

def load_interviews():
    if not os.path.exists(INTERVIEWS_FILE):
        return []
    with open(INTERVIEWS_FILE, "r") as f:
        return json.load(f)

def save_interviews(interviews):
    with open(INTERVIEWS_FILE, "w") as f:
        json.dump(interviews, f, indent=2)

@app.post("/admin/schedule_interview/")
async def schedule_interview(request: Request):
    data = await request.json()
    # expects: { email, round, date, notes }
    interviews = load_interviews()
    interviews.append(data)
    save_interviews(interviews)
    return {"status": "scheduled"}

@app.get("/admin/get_interviews/")
async def get_interviews(email: str = None):
    interviews = load_interviews()
    if email:
        interviews = [i for i in interviews if i.get("email") == email]
    return {"interviews": interviews}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AspiroNest Backend Running"}

# Placeholder for resume upload
import io
from fastapi import HTTPException
from PyPDF2 import PdfReader
import re

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    text = ""
    import spacy
    import pdfplumber
    import pytesseract
    from PIL import Image
    nlp = spacy.load('en_core_web_sm')

    # Try extracting text with PyPDF2, fallback to pdfplumber OCR if empty
    try:
        reader = PdfReader(io.BytesIO(contents))
        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text
    except Exception:
        text = ""
    if not text.strip():
        # Fallback to OCR with pdfplumber + pytesseract
        try:
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    im = page.to_image(resolution=300).original
                    page_text = pytesseract.image_to_string(im)
                    text += page_text
        except Exception:
            pass

    # NLP-based skill extraction
    SKILL_KEYWORDS = [
        "python", "java", "c++", "javascript", "react", "node", "sql", "html", "css", "machine learning", "data analysis", "nlp", "ocr", "aws", "azure", "git", "docker", "kubernetes", "tensorflow", "pytorch", "excel", "powerbi", "tableau"
    ]
    found_skills = set()
    doc = nlp(text)
    for token in doc:
        if token.text.lower() in SKILL_KEYWORDS:
            found_skills.add(token.text.lower())
    # Also regex fallback for skills
    for skill in SKILL_KEYWORDS:
        if re.search(r'\\b' + re.escape(skill) + r'\\b', text, re.IGNORECASE):
            found_skills.add(skill)
    found_skills = list(found_skills)

    # Work experience extraction: look for job titles, companies, and date patterns
    work_exp_lines = []
    for sent in doc.sents:
        if re.search(r'(experience|worked at|intern|company|employer|position|role|engineer|developer|analyst|manager|consultant)', sent.text, re.IGNORECASE):
            work_exp_lines.append(sent.text.strip())
        # Look for year/date range
        elif re.search(r'\b(19|20)\d{2}\b', sent.text):
            work_exp_lines.append(sent.text.strip())
    work_experience = '\n'.join(work_exp_lines)

    # Extract CGPA or marks (simple: look for CGPA, GPA, or % pattern)
    cgpa_match = re.search(r'(CGPA|GPA)\s*[:=\-]?\s*([0-9]\.?[0-9]{0,2})', text, re.IGNORECASE)
    percent_match = re.search(r'(\d{1,2}\.\d{1,2}|\d{2,3})\s*%|percentage', text)
    cgpa = cgpa_match.group(2) if cgpa_match else None
    marks = percent_match.group(0) if percent_match else None

    summary = text[:500] + ("..." if len(text) > 500 else "")
    # Simple ATS score: number of skills * 5 + number of work experience lines * 10 (max 100)
    ats_score = min(100, len(found_skills) * 5 + len(work_exp_lines) * 10)

    return {
        "skills": found_skills,
        "work_experience": work_experience,
        "cgpa": cgpa,
        "marks": marks,
        "ats_score": ats_score,
        "status": "scanned"
    }

# Placeholder for ATS scoring
@app.post("/ats_score/")
async def ats_score():
    # TODO: Implement ATS scoring logic
    return {"score": 85}

# Job recommendation endpoint
from fastapi import Query

JOBS_DB = [
    {"title": "Python Developer", "skills": ["python", "django", "flask"], "company": "TechNova"},
    {"title": "Frontend Engineer", "skills": ["react", "javascript", "css", "html"], "company": "WebWorks"},
    {"title": "Data Analyst", "skills": ["excel", "sql", "data analysis", "powerbi"], "company": "InsightX"},
    {"title": "Machine Learning Engineer", "skills": ["python", "machine learning", "tensorflow", "pytorch"], "company": "AI Labs"},
    {"title": "DevOps Engineer", "skills": ["aws", "docker", "kubernetes", "git"], "company": "CloudOps"},
]

@app.post("/recommend_jobs/")
async def recommend_jobs(skills: list = Query(None)):
    # skills: list of skill strings
    if not skills:
        # If no skills provided, return all jobs
        return {"jobs": JOBS_DB}
    # Score jobs by number of matching skills
    scored_jobs = []
    for job in JOBS_DB:
        match_count = len([s for s in job["skills"] if s in skills])
        scored_jobs.append((match_count, job))
    # Sort by match_count descending, then by job title
    scored_jobs.sort(key=lambda x: (-x[0], x[1]["title"]))
    return {"jobs": [job for _, job in scored_jobs]}


# Placeholder for feedback
@app.post("/feedback/")
async def feedback(feedback: str = Form(...)):
    # TODO: Save feedback
    return {"status": "received"}

# Placeholder for chatbot
@app.post("/chatbot/")
async def chatbot(query: str = Form(...)):
    # TODO: Integrate AI chatbot
    return {"response": "This is a placeholder response."}

# JSON endpoint for chatbot (for frontend)
from fastapi import Body

@app.post("/chatbot")
async def chatbot_json(request: Request):
    data = await request.json()
    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' in request body.")
    # TODO: Integrate chatbot logic here
    return {"answer": f"You asked: {question}. This is a placeholder answer."}
