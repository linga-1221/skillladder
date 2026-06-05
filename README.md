# 🚀 Skill Ladder — AI-Powered Career Launchpad

Skill Ladder is a full-stack career development platform that helps job seekers and job providers connect through AI-driven resume analysis, smart job matching, skill development tools, and proctored assessments.

---

## 📁 Project Structure

```
skillladder/
├── project1/project1/
│   ├── backend/              # FastAPI Python backend
│   │   ├── routers/          # Auth & Jobs API routers
│   │   ├── services/         # Resume parser service
│   │   ├── main.py           # Main FastAPI app
│   │   ├── firebase_service.py
│   │   ├── db.py
│   │   └── requirements.txt
│   ├── frontend/             # React.js frontend
│   │   ├── src/
│   │   │   ├── components/   # All React components
│   │   │   │   └── dashboard/# Role-based dashboards
│   │   │   ├── firebase/     # Firebase config
│   │   │   └── App.js
│   │   └── package.json
│   └── code-runner/          # Code execution service
└── python-compiler/          # Python compiler microservice
```

---

## ✨ Features

### 👤 For Job Seekers
- **AI Resume Analysis** — Upload PDF resumes, extract skills & CGPA, get ATS compatibility scores and optimization tips
- **Smart Job Matching** — Skill-based job recommendations from 15+ curated listings
- **Career Guidance** — Personalized learning paths and career counselling
- **Mock Tests & Exams** — Proctored assessments with score tracking
- **Code Practice** — In-browser code compiler and practice environment
- **Progress Tracking** — Dashboard with application history and skill progress

### 🏢 For Job Providers
- **Post & Manage Jobs** — Create, view, and delete job listings
- **Candidate Pipeline** — Track applications and manage hiring pipeline
- **Analytics Dashboard** — View application stats, skill distribution, and mock test scores
- **Interview Scheduling** — Schedule and manage interview rounds

### 🛡️ Admin
- **User Management** — View all registered users and their history
- **Interview Oversight** — Manage scheduled interviews across all users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, Tailwind CSS, Recharts |
| Backend | FastAPI, Python, Uvicorn |
| Authentication | Firebase Auth + JWT (python-jose) |
| Database | Firebase Firestore |
| PDF Processing | PyPDF2 |
| Password Hashing | bcrypt |
| Code Execution | Custom Flask microservice |
| Deployment | Vercel (frontend) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 16
- Python >= 3.9
- Firebase project with Firestore enabled

---

### 🔧 Backend Setup

```bash
cd project1/project1/backend
pip install -r requirements.txt
```

Create a `.env` file:
```env
SUPABASE_JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=your-firebase-project-id
```

Add your `firebase-service-account.json` (never commit this file).

Start the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

---

### 💻 Frontend Setup

```bash
cd project1/project1/frontend
npm install
npm start
```

The app runs on `http://localhost:3000`.

Configure Firebase in `src/firebase/config.js` with your project credentials.

---

### 🐍 Python Compiler Service (optional)

```bash
cd python-compiler/python-compiler
pip install -r requirements.txt
python app.py
```

---

### ▶️ Quick Start (Windows)

Double-click `QUICK_START.bat` or `START_BOTH.bat` in the project root to launch both backend and frontend together.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get session |
| POST | `/upload_resume` | Upload and parse PDF resume |
| POST | `/recommend_jobs` | Get skill-based job recommendations |
| GET | `/get_all_jobs` | Fetch all available jobs |
| POST | `/post_job` | Post a new job (providers) |
| DELETE | `/delete_job/{id}` | Delete a job posting |
| POST | `/apply_job` | Apply for a job |
| GET | `/get_job_applications` | Get applications |
| POST | `/submit_mock_test` | Submit mock test result |
| GET | `/get_provider_analytics` | Analytics for job providers |
| POST | `/admin/schedule_interview` | Schedule an interview |
| GET | `/test-firebase` | Test Firebase connectivity |

---

## 👥 User Roles

| Role | Access |
|---|---|
| `job_seeker` | Resume upload, job search, mock tests, learning, career guidance |
| `job_provider` | Post jobs, view applications, analytics, pipeline management |
| `admin` | Full user management, interview scheduling |

---

## 🔐 Security Notes

- `.env` files are gitignored — never commit secrets
- `firebase-service-account.json` is gitignored — add it locally only
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- CORS is restricted to localhost in development

---

## 🚀 Deployment

### Vercel (Frontend)

Set the following in your Vercel project settings:

| Setting | Value |
|---|---|
| Root Directory | `project1/project1/frontend` |
| Build Command | `npm run build` |
| Output Directory | `build` |

A `vercel.json` is included at the repo root for automatic configuration.

### Backend

Deploy the FastAPI backend to any Python-compatible host (Railway, Render, EC2, etc.) and update the API URLs in the frontend components accordingly.

---

## 🧩 Key Components

| Component | Description |
|---|---|
| `Login.js` | Auth with role-based routing |
| `ResumeUpload.js` | PDF upload with ATS scoring |
| `JobFinderPage.js` | Browse and filter all jobs |
| `JobRecommendations.js` | AI skill-matched job cards |
| `JobSeekerDashboard.js` | Student/job seeker home |
| `JobProviderDashboard.js` | Employer home with analytics |
| `ExamComponent.js` | Proctored exam interface |
| `Compiler.js` | In-browser code compiler |
| `LearnPlatform.js` | Learning path generator |
| `AdminPanel.js` | Admin user & interview management |

---

## 📦 Dependencies

### Backend (`requirements.txt`)
```
fastapi, uvicorn, python-multipart, pydantic, python-dotenv
openai, PyPDF2, firebase-admin, flask
python-jose[cryptography], passlib[bcrypt], bcrypt, supabase
```

### Frontend (`package.json`)
```
react 18, react-router-dom 7, firebase 12
tailwindcss 3, recharts, @headlessui/react, @heroicons/react
```

---

## 🐛 Troubleshooting

**Resume upload stuck?**
- Backend auto-falls back after 15 seconds
- Ensure backend is running on port 8001
- Upload must be a valid PDF

**Learning path not generating?**
- Auto-falls back to local processing after 10 seconds
- Check Firebase config in `src/firebase/config.js`

**Firebase errors?**
- All features have local fallbacks
- Verify `firebase-service-account.json` is present in the backend folder
- Check `FIREBASE_SETUP_INSTRUCTIONS.md` in the backend folder

---

## 📄 License

This project is for educational purposes.

---

> Built with ❤️ — Skill Ladder Team
