<div align="center">

# 🪜 Skill Ladder

### AI-Powered Career Development & Job Recommendation Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-skillladder.vercel.app-6366f1?style=for-the-badge)](https://skillladder.vercel.app)
[![IEEE Published](https://img.shields.io/badge/📄_IEEE-Published_Research-00629B?style=for-the-badge&logo=ieee)](https://ieee.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=flat)](https://spacy.io)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

*Helping job seekers climb the career ladder — one AI-powered match at a time.*

</div>

---

## 📌 What Is Skill Ladder?

Skill Ladder is a full-stack AI platform that bridges the gap between job seekers and opportunities. It goes beyond keyword matching — it **understands your resume**, identifies your skill gaps, and recommends jobs and learning resources tailored to your actual profile.

Built as an IEEE research project and deployed live at **[skillladder.vercel.app](https://skillladder.vercel.app)**.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📋 **ATS Resume Evaluation** | Parses resumes using NLP and scores them against job descriptions with detailed skill gap analysis |
| 🤖 **AI Job Recommendations** | Matches candidates to roles using vector similarity — shows *why* each job fits, not just a score |
| 📚 **Learning Resource Engine** | Recommends courses and resources to close identified skill gaps |
| 📊 **Application Tracker** | Real-time dashboard to track job applications, statuses, and deadlines |
| 🏢 **Recruiter Pipeline** | Hiring analytics and candidate ranking for recruiters |
| 🔐 **Auth & Profiles** | Secure Firebase Authentication with persistent user profiles |

---

## 🛠️ Tech Stack

```
Frontend          → React.js, Tailwind CSS
Backend API       → FastAPI (Python)
NLP / AI          → spaCy, PyPDF2, pdfplumber
Database          → Firebase Firestore
Authentication    → Firebase Auth
Deployment        → Vercel (Frontend), Render (Backend)
```

---

## 🗂️ Project Structure

```
skillladder/
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   └── services/       # API calls and Firebase hooks
│   └── package.json
│
├── backend/                # FastAPI Python backend
│   ├── main.py             # Entry point & route definitions
│   ├── resume_parser.py    # spaCy NLP resume extraction
│   ├── job_matcher.py      # Similarity scoring engine
│   └── requirements.txt
│
├── code-runner/            # Isolated code execution service
├── firestore.rules         # Firebase security rules
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Firebase project (for Auth + Firestore)

### 1. Clone the repo
```bash
git clone https://github.com/linga-1221/skillladder.git
cd skillladder
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🧠 How It Works

```
User uploads resume (PDF)
        ↓
spaCy + pdfplumber extract:
  skills, experience, education, keywords
        ↓
FastAPI computes vector similarity score
against job descriptions
        ↓
Top matches returned with:
  ✅ Match %
  🔴 Missing skills
  📚 Recommended courses
  📄 ATS improvement tips
        ↓
Results displayed in React dashboard
```

---

## 📸 Screenshots

> *Coming soon — [Live demo available at skillladder.vercel.app](https://skillladder.vercel.app)*

---

## 📄 Research

This project was developed as part of an **IEEE-published research paper** exploring AI-driven career development systems and NLP-based resume evaluation at scale.

---

## 🚀 Roadmap

- [ ] LangChain RAG integration for contextual job matching
- [ ] Cover letter generator (LLM-powered)
- [ ] Interview question predictor based on job description
- [ ] Multi-language resume support
- [ ] Chrome extension for one-click job application analysis

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
git checkout -b feature/your-feature
git commit -m "Add: your feature description"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📬 Contact

**Nagalinga K.**
- 💼 LinkedIn: [linkedin.com/in/nagalinga-k](https://linkedin.com/in/nagalinga-k)
- 📧 Email: nagakuchivaripalli@gmail.com
- 🐙 GitHub: [@linga-1221](https://github.com/linga-1221)

---

<div align="center">

⭐ **Star this repo if Skill Ladder helped or inspired you!**

*Made with 🧠 and too much coffee by [Nagalinga K.](https://github.com/linga-1221)*

</div>
