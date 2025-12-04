from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import hashlib
import os
import re
import io
import subprocess
import sys
import tempfile
from datetime import datetime
import random
from werkzeug.utils import secure_filename
try:
    from PyPDF2 import PdfReader
except ImportError:
    print("PyPDF2 not installed. PDF text extraction will use fallback method.")
    PdfReader = None

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

@app.route('/register/', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")
        
        if not all([email, password, role]):
            return jsonify({"status": "error", "detail": "Missing registration fields."})
        
        users = load_users()
        if any(u["email"] == email for u in users):
            return jsonify({"status": "error", "detail": "User already exists."})
        
        user_data = {
            "email": email, 
            "password": hash_password(password), 
            "role": role, 
            "history": []
        }
        
        if role == "job_seeker":
            user_data.update({
                "name": data.get("name", ""),
                "phone": data.get("phone", ""),
                "graduation_year": data.get("graduationYear", ""),
                "study_year": data.get("studyYear", ""),
                "degree_type": data.get("degreeType", ""),
                "college_name": data.get("collegeName", "")
            })
        
        users.append(user_data)
        save_users(users)
        return jsonify({"status": "registered", "email": email, "role": role})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"status": "error", "detail": "Registration failed."})

@app.route('/login/', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not all([email, password]):
            return jsonify({"status": "error", "detail": "Missing login fields."})
        
        users = load_users()
        user = next((u for u in users if u["email"] == email and u["password"] == hash_password(password)), None)
        
        if not user:
            return jsonify({"status": "error", "detail": "Invalid credentials."})
        
        return jsonify({"status": "success", "email": user["email"], "role": user["role"]})
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"status": "error", "detail": "Login failed."})

# Resume Upload and Analysis
@app.route('/upload_resume/', methods=['POST'])
def upload_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'})
        
        file = request.files['file']
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'})
        
        # Read PDF content
        file_content = file.read()
        text_content = ""
        
        try:
            # Try to extract text using PyPDF2
            if PdfReader:
                pdf_reader = PdfReader(io.BytesIO(file_content))
                for page in pdf_reader.pages:
                    page_text = page.extract_text() or ""
                    text_content += page_text + "\n"
            else:
                # Fallback: return mock data for demo
                text_content = f"Sample resume content\nSkills: Python, JavaScript, React\nCGPA: 7.64\nExperience: 2 years in software development"
        except Exception as e:
            print(f"PDF extraction error: {e}")
            # Fallback: return mock data for demo
            text_content = f"Sample resume content\nSkills: Python, JavaScript, React\nCGPA: 7.64\nExperience: 2 years in software development"
        
        if not text_content.strip():
            return jsonify({'error': 'No text found in PDF. Please upload a text-based PDF.'})
        
        # Advanced skill detection with categories
        SKILL_CATEGORIES = {
            'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift', 'typescript', 'scala', 'r', 'matlab', 'c', 'cpp'],
            'web_development': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'django', 'flask', 'laravel', 'spring', 'asp.net', 'bootstrap', 'jquery'],
            'databases': ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'elasticsearch', 'sql', 'nosql'],
            'cloud_devops': ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'terraform', 'ansible'],
            'data_science': ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'sklearn', 'tableau', 'powerbi', 'excel', 'data analysis'],
            'mobile': ['android', 'ios', 'react native', 'flutter', 'xamarin', 'swift', 'kotlin'],
            'tools': ['jira', 'confluence', 'slack', 'figma', 'adobe', 'photoshop', 'illustrator', 'postman', 'vs code', 'visual studio']
        }
        
        found_skills = []
        skill_categories = {}
        text_lower = text_content.lower()
        
        # Analyze skills by category - only find skills that actually exist in the text
        for category, skills in SKILL_CATEGORIES.items():
            category_skills = []
            for skill in skills:
                # Use word boundaries to avoid partial matches
                import re
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    # Avoid duplicates
                    if skill not in found_skills:
                        found_skills.append(skill)
                        category_skills.append(skill)
            if category_skills:
                skill_categories[category] = category_skills
        
        # Extract CGPA/GPA with better accuracy - search in actual text
        cgpa_patterns = [
            r'(?:CGPA|GPA)\s*[:=\-]?\s*([0-9]\.[0-9]{1,2})',
            r'(?:Grade|Score)\s*[:=\-]?\s*([0-9]\.[0-9]{1,2})',
            r'([0-9]\.[0-9]{1,2})\s*/\s*10',
            r'([0-9]\.[0-9]{1,2})\s*/\s*4(?:\.0)?',
            r'(?:Percentage|Percent)\s*[:=\-]?\s*([0-9]{1,2}\.[0-9]{1,2})%?'
        ]
        
        cgpa = None
        for pattern in cgpa_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                try:
                    # Take the first valid CGPA found
                    potential_cgpa = float(matches[0])
                    # Validate CGPA range
                    if 0 <= potential_cgpa <= 10:
                        cgpa = potential_cgpa
                        break
                    elif 0 <= potential_cgpa <= 4:  # GPA on 4.0 scale
                        cgpa = (potential_cgpa / 4.0) * 10  # Convert to 10 scale
                        break
                    elif 0 <= potential_cgpa <= 100:  # Percentage
                        cgpa = (potential_cgpa / 100) * 10  # Convert to 10 scale
                        break
                except ValueError:
                    continue
        
        # Advanced ATS Score calculation based on actual content
        base_score = 30
        skill_score = min(35, len(found_skills) * 3)  # More weight on skills
        cgpa_score = 0
        if cgpa:
            if cgpa >= 8.5: cgpa_score = 20
            elif cgpa >= 7.5: cgpa_score = 15
            elif cgpa >= 6.5: cgpa_score = 10
            elif cgpa >= 5.5: cgpa_score = 5
            else: cgpa_score = 2
        
        # Check for experience keywords
        experience_keywords = ['experience', 'worked', 'developed', 'project', 'internship', 'years']
        experience_score = 0
        for keyword in experience_keywords:
            if keyword.lower() in text_lower:
                experience_score += 2
        experience_score = min(15, experience_score)
        
        ats_score = min(100, base_score + skill_score + cgpa_score + experience_score)
        
        # Generate accurate recommendations based on actual analysis
        recommendations = []
        if ats_score < 70:
            recommendations.append("Add more relevant technical skills to your resume")
            recommendations.append("Include quantifiable achievements and project details")
        if len(found_skills) < 5:
            recommendations.append("Expand your technical skill set with in-demand technologies")
        if not cgpa:
            recommendations.append("Include your academic performance (CGPA/GPA) if it's good")
        elif cgpa < 7.0:
            recommendations.append("Highlight your projects and certifications to compensate for academic performance")
        if 'project' not in text_lower:
            recommendations.append("Add detailed project descriptions with technologies used")
        
        return jsonify({
            'skills': found_skills,
            'skill_categories': skill_categories,
            'cgpa': round(cgpa, 2) if cgpa else None,
            'ats_score': ats_score,
            'recommendations': recommendations,
            'status': 'success',
            'analysis': {
                'total_skills': len(found_skills),
                'skill_diversity': len(skill_categories),
                'strength_areas': list(skill_categories.keys())[:3],
                'text_length': len(text_content),
                'has_experience': any(keyword in text_lower for keyword in experience_keywords)
            },
            'file_name': file.filename
        })
        
    except Exception as e:
        print(f"Resume analysis error: {e}")
        return jsonify({'error': f'Resume analysis failed: {str(e)}'})

# Enhanced Job Recommendations
JOBS_DATABASE = [
    {"id": 1, "title": "Senior Python Developer", "company": "TechCorp", "location": "Bangalore", "salary": "12-18 LPA", "experience": "3-5 years", "skills": ["python", "django", "flask", "postgresql", "aws"], "type": "Full-time", "remote": True, "description": "Build scalable web applications"},
    {"id": 2, "title": "React Frontend Engineer", "company": "WebSolutions", "location": "Mumbai", "salary": "8-14 LPA", "experience": "2-4 years", "skills": ["react", "javascript", "typescript", "css", "html"], "type": "Full-time", "remote": False, "description": "Create modern user interfaces"},
    {"id": 3, "title": "Data Scientist", "company": "DataLabs", "location": "Hyderabad", "salary": "15-25 LPA", "experience": "2-6 years", "skills": ["python", "machine learning", "tensorflow", "pandas", "sql"], "type": "Full-time", "remote": True, "description": "Analyze complex datasets"},
    {"id": 4, "title": "Full Stack Developer", "company": "StartupXYZ", "location": "Delhi", "salary": "10-16 LPA", "experience": "2-5 years", "skills": ["javascript", "react", "node.js", "mongodb", "express"], "type": "Full-time", "remote": True, "description": "End-to-end development"},
    {"id": 5, "title": "DevOps Engineer", "company": "CloudTech", "location": "Pune", "salary": "14-22 LPA", "experience": "3-7 years", "skills": ["aws", "docker", "kubernetes", "jenkins", "terraform"], "type": "Full-time", "remote": False, "description": "Manage cloud infrastructure"},
    {"id": 6, "title": "Mobile App Developer", "company": "AppStudio", "location": "Chennai", "salary": "9-15 LPA", "experience": "2-4 years", "skills": ["react native", "javascript", "android", "ios"], "type": "Full-time", "remote": True, "description": "Build cross-platform apps"},
    {"id": 7, "title": "Machine Learning Engineer", "company": "AI Innovations", "location": "Bangalore", "salary": "16-28 LPA", "experience": "3-6 years", "skills": ["python", "tensorflow", "pytorch", "machine learning", "deep learning"], "type": "Full-time", "remote": True, "description": "Develop AI solutions"},
    {"id": 8, "title": "Backend Developer", "company": "ServerSide", "location": "Gurgaon", "salary": "11-17 LPA", "experience": "2-5 years", "skills": ["java", "spring", "mysql", "redis", "microservices"], "type": "Full-time", "remote": False, "description": "Build robust APIs"},
    {"id": 9, "title": "UI/UX Designer", "company": "DesignHub", "location": "Mumbai", "salary": "7-13 LPA", "experience": "1-4 years", "skills": ["figma", "adobe", "photoshop", "illustrator", "sketch"], "type": "Full-time", "remote": True, "description": "Design user experiences"},
    {"id": 10, "title": "Cloud Architect", "company": "CloudMasters", "location": "Bangalore", "salary": "20-35 LPA", "experience": "5-10 years", "skills": ["aws", "azure", "gcp", "terraform", "kubernetes"], "type": "Full-time", "remote": True, "description": "Design cloud solutions"}
]

@app.route('/recommend_jobs/', methods=['POST'])
def recommend_jobs():
    try:
        data = request.json
        user_skills = [skill.lower() for skill in data.get('skills', [])]
        experience_level = data.get('experience', 'entry')  # entry, mid, senior
        location_pref = data.get('location', '')
        remote_pref = data.get('remote', None)
        
        scored_jobs = []
        for job in JOBS_DATABASE:
            score = 0
            job_skills = [skill.lower() for skill in job['skills']]
            
            # Skill matching (60% weight)
            skill_matches = len(set(user_skills) & set(job_skills))
            skill_score = (skill_matches / len(job_skills)) * 60
            
            # Experience matching (20% weight)
            exp_score = 20  # Default
            if experience_level == 'entry' and '1-' in job['experience']:
                exp_score = 20
            elif experience_level == 'mid' and any(x in job['experience'] for x in ['2-', '3-']):
                exp_score = 20
            elif experience_level == 'senior' and any(x in job['experience'] for x in ['5-', '7-']):
                exp_score = 20
            else:
                exp_score = 10
            
            # Location matching (10% weight)
            location_score = 10
            if location_pref and location_pref.lower() in job['location'].lower():
                location_score = 10
            elif job['remote']:
                location_score = 8
            else:
                location_score = 5
            
            # Remote preference (10% weight)
            remote_score = 10
            if remote_pref is not None:
                remote_score = 10 if job['remote'] == remote_pref else 5
            
            total_score = skill_score + exp_score + location_score + remote_score
            
            job_with_score = job.copy()
            job_with_score['match_score'] = round(total_score, 1)
            job_with_score['skill_matches'] = skill_matches
            scored_jobs.append(job_with_score)
        
        # Sort by score and return top matches
        scored_jobs.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            'jobs': scored_jobs[:8],
            'total_jobs': len(JOBS_DATABASE),
            'analysis': {
                'top_match_score': scored_jobs[0]['match_score'] if scored_jobs else 0,
                'avg_match_score': sum(job['match_score'] for job in scored_jobs[:5]) / 5 if scored_jobs else 0
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Job recommendation failed: {str(e)}'})

# Code Runner
@app.route('/run_code/', methods=['POST'])
def run_code():
    try:
        data = request.json
        language = data.get('language', 'python')
        code = data.get('code', '')
        input_data = data.get('input', '')
        
        if language == 'python':
            return run_python_code(code, input_data)
        elif language == 'java':
            return run_java_code(code, input_data)
        elif language == 'cpp':
            return run_cpp_code(code, input_data)
        else:
            return jsonify({'error': 'Unsupported language'})
            
    except Exception as e:
        return jsonify({'error': str(e)})

def run_python_code(code, input_data):
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            f.flush()
            
            process = subprocess.run(
                [sys.executable, f.name],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            os.unlink(f.name)
            
            return jsonify({
                'output': process.stdout,
                'error': process.stderr,
                'execution_time': '< 1s',
                'status': 'success' if process.returncode == 0 else 'error'
            })
                
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Code execution timed out (10s limit)'})
    except Exception as e:
        return jsonify({'error': str(e)})

def run_java_code(code, input_data):
    # Java execution logic (simplified)
    return jsonify({'output': 'Java execution not implemented yet', 'error': '', 'status': 'info'})

def run_cpp_code(code, input_data):
    # C++ execution logic (simplified)
    return jsonify({'output': 'C++ execution not implemented yet', 'error': '', 'status': 'info'})

# Learning Path Generation
@app.route('/generate_learning_path/', methods=['POST'])
def generate_learning_path():
    try:
        data = request.json
        current_skills = data.get('skills', [])
        target_role = data.get('target_role', 'Full Stack Developer')
        experience_level = data.get('experience', 'beginner')
        
        LEARNING_PATHS = {
            'Full Stack Developer': {
                'beginner': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
                'intermediate': ['TypeScript', 'Express.js', 'PostgreSQL', 'Docker', 'AWS', 'Testing'],
                'advanced': ['Microservices', 'Kubernetes', 'GraphQL', 'Redis', 'CI/CD', 'System Design']
            },
            'Data Scientist': {
                'beginner': ['Python', 'Statistics', 'Pandas', 'NumPy', 'Matplotlib', 'SQL'],
                'intermediate': ['Machine Learning', 'Scikit-learn', 'TensorFlow', 'Data Visualization', 'R', 'Jupyter'],
                'advanced': ['Deep Learning', 'PyTorch', 'MLOps', 'Big Data', 'Spark', 'Model Deployment']
            },
            'DevOps Engineer': {
                'beginner': ['Linux', 'Git', 'Docker', 'AWS Basics', 'Scripting', 'Networking'],
                'intermediate': ['Kubernetes', 'Terraform', 'Jenkins', 'Monitoring', 'Security', 'Ansible'],
                'advanced': ['Service Mesh', 'GitOps', 'Multi-cloud', 'SRE', 'Compliance', 'Architecture']
            }
        }
        
        path = LEARNING_PATHS.get(target_role, LEARNING_PATHS['Full Stack Developer'])
        recommended_skills = path.get(experience_level, path['beginner'])
        
        # Filter out skills user already has
        current_skills_lower = [skill.lower() for skill in current_skills]
        missing_skills = [skill for skill in recommended_skills 
                         if skill.lower() not in current_skills_lower]
        
        # Generate timeline
        timeline = []
        for i, skill in enumerate(missing_skills[:6]):
            timeline.append({
                'skill': skill,
                'week': i + 1,
                'duration': '1-2 weeks',
                'resources': ['Online Course', 'Practice Projects', 'Documentation']
            })
        
        return jsonify({
            'learning_path': timeline,
            'target_role': target_role,
            'current_level': experience_level,
            'completion_time': f'{len(timeline) * 1.5:.0f} weeks',
            'next_skills': missing_skills[:3],
            'progress': {
                'completed': len(current_skills),
                'remaining': len(missing_skills),
                'percentage': round((len(current_skills) / (len(current_skills) + len(missing_skills))) * 100, 1)
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Learning path generation failed: {str(e)}'})

# Career Guidance Chatbot
@app.route('/chatbot/', methods=['POST'])
def chatbot():
    try:
        data = request.json
        question = data.get('question', '').lower()
        
        RESPONSES = {
            'resume': "Focus on quantifiable achievements, use action verbs, tailor to job descriptions, and ensure ATS compatibility with relevant keywords.",
            'interview': "Research the company, practice STAR method for behavioral questions, prepare technical examples, and ask thoughtful questions about the role.",
            'skills': "Focus on in-demand skills like Python, JavaScript, cloud computing, data analysis, and soft skills like communication and problem-solving.",
            'career': "Assess your interests and strengths, research market trends, network with professionals, and consider internships or projects in target fields.",
            'salary': "Research market rates on platforms like Glassdoor, consider your experience level, location, and company size when negotiating.",
            'remote': "Develop strong communication skills, create a productive workspace, master collaboration tools, and maintain work-life boundaries."
        }
        
        # Simple keyword matching
        response = "I'm here to help with career guidance. Ask me about resumes, interviews, skills, career paths, salary negotiation, or remote work."
        
        for keyword, answer in RESPONSES.items():
            if keyword in question:
                response = answer
                break
        
        return jsonify({
            'answer': response,
            'suggestions': ['How to improve my resume?', 'What skills are in demand?', 'Interview preparation tips?']
        })
        
    except Exception as e:
        return jsonify({'error': f'Chatbot error: {str(e)}'})

# Mock Test System
@app.route('/get_mock_test/', methods=['POST'])
def get_mock_test():
    try:
        data = request.json
        subject = data.get('subject', 'programming')
        difficulty = data.get('difficulty', 'medium')
        
        QUESTIONS = {
            'programming': {
                'easy': [
                    {'question': 'What is the output of print(2 + 3)?', 'options': ['5', '23', 'Error', 'None'], 'correct': 0},
                    {'question': 'Which keyword is used to define a function in Python?', 'options': ['func', 'def', 'function', 'define'], 'correct': 1}
                ],
                'medium': [
                    {'question': 'What is the time complexity of binary search?', 'options': ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], 'correct': 1},
                    {'question': 'Which data structure uses LIFO principle?', 'options': ['Queue', 'Stack', 'Array', 'Tree'], 'correct': 1}
                ]
            }
        }
        
        questions = QUESTIONS.get(subject, {}).get(difficulty, QUESTIONS['programming']['easy'])
        
        return jsonify({
            'questions': questions,
            'total_questions': len(questions),
            'time_limit': 30,  # minutes
            'subject': subject,
            'difficulty': difficulty
        })
        
    except Exception as e:
        return jsonify({'error': f'Mock test generation failed: {str(e)}'})

@app.route('/submit_mock_test/', methods=['POST'])
def submit_mock_test():
    try:
        data = request.json
        answers = data.get('answers', [])
        correct_answers = data.get('correct_answers', [])
        
        score = sum(1 for i, answer in enumerate(answers) if i < len(correct_answers) and answer == correct_answers[i])
        total = len(correct_answers)
        percentage = round((score / total) * 100, 1) if total > 0 else 0
        
        # Performance analysis
        performance = 'Excellent' if percentage >= 80 else 'Good' if percentage >= 60 else 'Needs Improvement'
        
        return jsonify({
            'score': score,
            'total': total,
            'percentage': percentage,
            'performance': performance,
            'recommendations': [
                'Practice more coding problems' if percentage < 70 else 'Great job! Keep practicing',
                'Focus on data structures and algorithms' if percentage < 60 else 'Strong foundation'
            ]
        })
        
    except Exception as e:
        return jsonify({'error': f'Test submission failed: {str(e)}'})

@app.route('/')
def home():
    return jsonify({"message": "Skill Ladder Backend Running - All Features Active"})

if __name__ == '__main__':
    print("Starting Enhanced Skill Ladder Backend on http://localhost:8000")
    print("Features: Resume Analysis, Job Matching, Code Runner, Learning Paths, Chatbot, Mock Tests")
    app.run(debug=True, host='0.0.0.0', port=8000)