
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import hashlib
import uvicorn

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
    
    # Validate role
    if role not in ["job_seeker", "job_provider"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'job_seeker' or 'job_provider'.")
    
    users = load_users()
    if any(u["email"] == email for u in users):
        raise HTTPException(status_code=400, detail="User already exists.")
    
    # Create user object with additional fields for job seekers
    user_data = {
        "email": email, 
        "password": hash_password(password), 
        "role": role, 
        "history": []
    }
    
    # Add additional fields for job seekers
    if role == "job_seeker":
        name = data.get("name")
        phone = data.get("phone")
        graduation_year = data.get("graduationYear")
        study_year = data.get("studyYear")
        degree_type = data.get("degreeType")
        college_name = data.get("collegeName")

        if not all([name, phone, graduation_year, study_year, degree_type, college_name]):
            raise HTTPException(status_code=400, detail="Missing required fields for job seeker registration.")

        user_data.update({
            "name": name,
            "phone": phone,
            "graduation_year": graduation_year,
            "study_year": study_year,
            "degree_type": degree_type,
            "college_name": college_name
        })
    
    users.append(user_data)
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
    return {"message": "Skill Ladder Backend Running"}

# Placeholder for resume upload
import io
from fastapi import HTTPException
from PyPDF2 import PdfReader
import re

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        contents = await file.read()
        text = ""
        
        # Simple PDF text extraction using PyPDF2
        try:
            reader = PdfReader(io.BytesIO(contents))
            for page in reader.pages:
                page_text = page.extract_text() or ""
                text += page_text
        except Exception as e:
            print(f"PDF extraction error: {e}")
            # Fallback to basic text extraction
            text = f"Resume content for {file.filename}"
        
        # Simple skill extraction using regex patterns
        SKILL_KEYWORDS = [
            "python", "java", "c++", "javascript", "react", "node", "sql", "html", "css", 
            "machine learning", "data analysis", "aws", "azure", "git", "docker", 
            "kubernetes", "tensorflow", "pytorch", "excel", "powerbi", "tableau",
            "django", "flask", "spring", "express", "mongodb", "mysql", "postgresql",
            "redis", "jenkins", "jira", "confluence", "slack", "figma", "adobe",
            "photoshop", "illustrator", "agile", "scrum", "kanban", "waterfall",
            "devops", "ci/cd", "tdd", "bdd", "php", "ruby", "swift", "kotlin", "go",
            "rust", "typescript", "angular", "vue", "laravel", "asp.net"
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in SKILL_KEYWORDS:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        # Remove duplicates
        found_skills = list(set(found_skills))
        
        # Extract CGPA using regex
        cgpa_match = re.search(r'(CGPA|GPA)\s*[:=\-]?\s*([0-9]\.?[0-9]{0,2})', text, re.IGNORECASE)
        cgpa = float(cgpa_match.group(2)) if cgpa_match else None

        # Simple ATS score calculation
        ats_score = min(100, len(found_skills) * 3 + (20 if cgpa and cgpa >= 7.0 else 0) + 30)

        return {
            "skills": found_skills,
            "cgpa": cgpa,
            "ats_score": ats_score,
            "status": "scanned",
            "text_preview": text[:200] + "..." if len(text) > 200 else text
        }
        
    except Exception as e:
        print(f"Resume processing error: {e}")
        raise HTTPException(status_code=500, detail="Error processing resume file.")

# Placeholder for ATS scoring
@app.post("/ats_score/")
async def ats_score():
    # TODO: Implement ATS scoring logic
    return {"score": 85}

# Job recommendation endpoint
from fastapi import Query

JOBS_DB = [
    {"id": 1, "title": "Python Developer", "skills": ["python", "django", "flask", "sql"], "company": "TechNova", "location": "Bangalore", "salary": "8-15 LPA", "description": "Full-stack Python developer with Django/Flask experience", "rounds": "3", "website": "https://technova.com", "type": "Full-time", "posted_by": "techcorp@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 2, "title": "Frontend Engineer", "skills": ["react", "javascript", "css", "html", "typescript"], "company": "WebWorks", "location": "Mumbai", "salary": "6-12 LPA", "description": "React developer for modern web applications", "rounds": "2", "website": "https://webworks.com", "type": "Full-time", "posted_by": "webworks@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 3, "title": "Data Analyst", "skills": ["excel", "sql", "data analysis", "powerbi", "python"], "company": "InsightX", "location": "Delhi", "salary": "5-10 LPA", "description": "Data analysis and visualization specialist", "rounds": "2", "website": "https://insightx.com", "type": "Full-time", "posted_by": "insightx@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 4, "title": "Machine Learning Engineer", "skills": ["python", "machine learning", "tensorflow", "pytorch", "sql"], "company": "AI Labs", "location": "Hyderabad", "salary": "12-20 LPA", "description": "ML engineer for AI-powered applications", "rounds": "4", "website": "https://ailabs.com", "type": "Full-time", "posted_by": "ailabs@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 5, "title": "DevOps Engineer", "skills": ["aws", "docker", "kubernetes", "git", "jenkins"], "company": "CloudOps", "location": "Pune", "salary": "10-18 LPA", "description": "DevOps engineer for cloud infrastructure", "rounds": "3", "website": "https://cloudops.com", "type": "Full-time", "posted_by": "cloudops@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 6, "title": "Java Developer", "skills": ["java", "spring", "hibernate", "sql", "maven"], "company": "JavaCorp", "location": "Chennai", "salary": "7-14 LPA", "description": "Java developer with Spring framework experience", "rounds": "3", "website": "https://javacorp.com", "type": "Full-time", "posted_by": "javacorp@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 7, "title": "React Native Developer", "skills": ["react", "javascript", "react native", "mobile development"], "company": "MobileTech", "location": "Remote", "salary": "8-16 LPA", "description": "Mobile app developer using React Native", "rounds": "2", "website": "https://mobiletech.com", "type": "Full-time", "posted_by": "mobiletech@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 8, "title": "Full Stack Developer", "skills": ["javascript", "react", "node.js", "mongodb", "express"], "company": "FullStack Inc", "location": "Bangalore", "salary": "9-17 LPA", "description": "Full-stack developer for web applications", "rounds": "3", "website": "https://fullstack.com", "type": "Full-time", "posted_by": "fullstack@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 9, "title": "Data Scientist", "skills": ["python", "machine learning", "statistics", "sql", "pandas"], "company": "DataCorp", "location": "Mumbai", "salary": "11-19 LPA", "description": "Data scientist for business intelligence", "rounds": "4", "website": "https://datacorp.com", "type": "Full-time", "posted_by": "datacorp@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 10, "title": "UI/UX Designer", "skills": ["figma", "adobe", "photoshop", "illustrator", "design"], "company": "DesignHub", "location": "Delhi", "salary": "6-12 LPA", "description": "Creative designer for digital products", "rounds": "2", "website": "https://designhub.com", "type": "Full-time", "posted_by": "designhub@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 11, "title": "Python Intern", "skills": ["python", "basic programming"], "company": "TechStart", "location": "Remote", "salary": "2-4 LPA", "description": "Internship for Python programming", "rounds": "1", "website": "https://techstart.com", "type": "Internship", "posted_by": "techstart@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 12, "title": "Web Development Intern", "skills": ["html", "css", "javascript", "basic programming"], "company": "WebStart", "location": "Hyderabad", "salary": "2-5 LPA", "description": "Internship for web development", "rounds": "1", "website": "https://webstart.com", "type": "Internship", "posted_by": "webstart@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 13, "title": "Data Analysis Intern", "skills": ["excel", "basic statistics", "data entry"], "company": "DataStart", "location": "Pune", "salary": "2-4 LPA", "description": "Internship for data analysis", "rounds": "1", "website": "https://datastart.com", "type": "Internship", "posted_by": "datastart@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 14, "title": "React Intern", "skills": ["javascript", "html", "css", "basic react"], "company": "ReactStart", "location": "Chennai", "salary": "2-5 LPA", "description": "Internship for React development", "rounds": "1", "website": "https://reactstart.com", "type": "Internship", "posted_by": "reactstart@gmail.com", "posted_date": "2024-01-01", "status": "active"},
    {"id": 15, "title": "Java Intern", "skills": ["java", "basic programming", "oop"], "company": "JavaStart", "location": "Bangalore", "salary": "2-4 LPA", "description": "Internship for Java development", "rounds": "1", "website": "https://javastart.com", "type": "Internship", "posted_by": "javastart@gmail.com", "posted_date": "2024-01-01", "status": "active"}
]

@app.post("/recommend_jobs/")
async def recommend_jobs(request: Request):
    data = await request.json()
    skills = data.get("skills", [])
    
    if not skills:
        # If no skills provided, return all jobs
        return {"jobs": JOBS_DB}
    
    # Score jobs by number of matching skills and skill relevance
    scored_jobs = []
    for job in JOBS_DB:
        match_count = len([s for s in job["skills"] if s.lower() in [skill.lower() for skill in skills]])
        # Bonus points for exact skill matches
        exact_matches = len([s for s in job["skills"] if s.lower() in [skill.lower() for skill in skills]])
        score = match_count * 2 + exact_matches
        
        scored_jobs.append((score, job))
    
    # Sort by score descending, then by job title
    scored_jobs.sort(key=lambda x: (-x[0], x[1]["title"]))
    
    # Return top 10 most relevant jobs
    recommended_jobs = [job for _, job in scored_jobs[:10]]
    
    return {
        "jobs": recommended_jobs,
        "total_matches": len(scored_jobs),
        "skills_analyzed": skills
    }

@app.get("/get_all_jobs/")
async def get_all_jobs():
    return {"jobs": JOBS_DB}

# Store job applications
JOB_APPLICATIONS = []

# Store mock test results
MOCK_TEST_RESULTS = []

@app.post("/apply_job/")
async def apply_job(request: Request):
    try:
        data = await request.json()
        job_id = data.get("job_id")
        user_email = data.get("user_email")
        
        if not job_id or not user_email:
            raise HTTPException(status_code=400, detail="Missing job_id or user_email")
        
        # Check if job exists
        job = next((j for j in JOBS_DB if j["id"] == job_id), None)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if user already applied
        existing_application = next((app for app in JOB_APPLICATIONS if app["job_id"] == job_id and app["user_email"] == user_email), None)
        if existing_application:
            raise HTTPException(status_code=400, detail="User already applied for this job")
        
        # Add application
        application = {
            "id": len(JOB_APPLICATIONS) + 1,
            "job_id": job_id,
            "user_email": user_email,
            "job_title": job["title"],
            "company": job["company"],
            "applied_at": "2024-01-01T00:00:00Z",
            "status": "applied"
        }
        
        JOB_APPLICATIONS.append(application)
        
        return {
            "status": "success",
            "message": f"Successfully applied for {job['title']} at {job['company']}",
            "job_id": job_id,
            "application_id": application["id"],
            "applied_at": application["applied_at"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in apply_job: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/get_job_applications/")
async def get_job_applications(job_id: int = None, user_email: str = None):
    if job_id:
        applications = [app for app in JOB_APPLICATIONS if app["job_id"] == job_id]
    elif user_email:
        applications = [app for app in JOB_APPLICATIONS if app["user_email"] == user_email]
    else:
        applications = JOB_APPLICATIONS
    
    return {"applications": applications}

# Job Provider Endpoints
@app.post("/post_job/")
async def post_job(request: Request):
    try:
        data = await request.json()
        required_fields = ["title", "company", "location", "salary", "description", "skills", "posted_by"]
        
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Create new job
        new_job = {
            "id": len(JOBS_DB) + 1,
            "title": data["title"],
            "company": data["company"],
            "location": data["location"],
            "salary": data["salary"],
            "description": data["description"],
            "skills": data["skills"],
            "rounds": data.get("rounds", "3"),
            "website": data.get("website", ""),
            "type": data.get("type", "Full-time"),
            "posted_by": data["posted_by"],
            "posted_date": "2024-01-01",
            "status": "active"
        }
        
        JOBS_DB.append(new_job)
        
        return {
            "status": "success",
            "message": "Job posted successfully",
            "job_id": new_job["id"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in post_job: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/delete_job/{job_id}")
async def delete_job(job_id: int, posted_by: str):
    try:
        # Find job
        job = next((j for j in JOBS_DB if j["id"] == job_id), None)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if user posted this job
        if job["posted_by"] != posted_by:
            raise HTTPException(status_code=403, detail="Not authorized to delete this job")
        
        # Remove job
        JOBS_DB.remove(job)
        
        # Remove related applications
        global JOB_APPLICATIONS
        JOB_APPLICATIONS = [app for app in JOB_APPLICATIONS if app["job_id"] != job_id]
        
        return {"status": "success", "message": "Job deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in delete_job: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/get_jobs_by_provider/")
async def get_jobs_by_provider(posted_by: str):
    jobs = [job for job in JOBS_DB if job["posted_by"] == posted_by]
    return {"jobs": jobs}

# Mock Test Results
@app.post("/submit_mock_test/")
async def submit_mock_test(request: Request):
    try:
        data = await request.json()
        required_fields = ["user_email", "score", "total_questions", "subject"]
        
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        result = {
            "id": len(MOCK_TEST_RESULTS) + 1,
            "user_email": data["user_email"],
            "score": data["score"],
            "total_questions": data["total_questions"],
            "percentage": round((data["score"] / data["total_questions"]) * 100, 2),
            "subject": data["subject"],
            "submitted_at": "2024-01-01T00:00:00Z"
        }
        
        MOCK_TEST_RESULTS.append(result)
        
        return {
            "status": "success",
            "message": "Mock test result submitted successfully",
            "result_id": result["id"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in submit_mock_test: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/get_mock_test_results/")
async def get_mock_test_results(user_email: str = None):
    if user_email:
        results = [result for result in MOCK_TEST_RESULTS if result["user_email"] == user_email]
    else:
        results = MOCK_TEST_RESULTS
    
    return {"results": results}

# Analytics for Job Providers
@app.get("/get_provider_analytics/")
async def get_provider_analytics(posted_by: str):
    try:
        # Get jobs posted by this provider
        provider_jobs = [job for job in JOBS_DB if job["posted_by"] == posted_by]
        
        # Get applications for these jobs
        job_ids = [job["id"] for job in provider_jobs]
        applications = [app for app in JOB_APPLICATIONS if app["job_id"] in job_ids]
        
        # Get mock test results for applicants
        applicant_emails = list(set([app["user_email"] for app in applications]))
        mock_results = [result for result in MOCK_TEST_RESULTS if result["user_email"] in applicant_emails]
        
        # Calculate analytics
        total_jobs = len(provider_jobs)
        total_applications = len(applications)
        total_applicants = len(applicant_emails)
        total_mock_tests = len(mock_results)
        
        # Average mock test score
        avg_score = 0
        if mock_results:
            avg_score = sum(result["percentage"] for result in mock_results) / len(mock_results)
        
        # Job-wise application count
        job_applications = {}
        for job in provider_jobs:
            job_applications[job["title"]] = len([app for app in applications if app["job_id"] == job["id"]])
        
        # Skills distribution
        all_skills = []
        for job in provider_jobs:
            all_skills.extend(job["skills"])
        
        skill_counts = {}
        for skill in all_skills:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
        
        return {
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "total_applicants": total_applicants,
            "total_mock_tests": total_mock_tests,
            "average_mock_score": round(avg_score, 2),
            "job_applications": job_applications,
            "skill_distribution": skill_counts,
            "recent_applications": applications[-10:] if applications else [],
            "recent_mock_results": mock_results[-10:] if mock_results else []
        }
    except Exception as e:
        print(f"Error in get_provider_analytics: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
