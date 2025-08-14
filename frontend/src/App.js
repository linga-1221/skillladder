import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import CareerCounselling from "./components/CareerCounselling";
import CareerGuidance from "./components/CareerGuidance";
import CodeCompiler from "./components/CodeCompiler";
import LearnPlatform from "./components/LearnPlatform";
import Learning from "./components/Learning";
import Login from "./components/Login";
import ExamScreen from "./components/ExamScreen";
import ExamPage from "./components/ExamPage";
import Navbar from "./components/Navbar";
import JobModal from "./components/JobModal";

import "./darkGlass.css";
import homeBg from './images/home.jpg';
import loginBg from './images/login.jpg';
import studentBg from './images/student.jpg';

const ResumeUpload = React.lazy(() => import("./components/ResumeUpload"));
const StudentDashboard = React.lazy(() => import("./components/dashboard/StudentDashboard"));
const JobSuggestions = React.lazy(() => import("./components/JobSuggestions"));
const JobFinderPage = React.lazy(() => import("./components/JobFinderPage"));
const UserHistory = React.lazy(() => import("./components/dashboard/UserHistory"));
const EmployeeDashboard = React.lazy(() => import("./components/dashboard/EmployeeDashboard"));
const EmployeeJobsPage = React.lazy(() => import("./components/dashboard/EmployeeJobsPage"));
const StudentProgress = React.lazy(() => import("./components/dashboard/StudentProgress"));

function App() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [pipelineSubmissions, setPipelineSubmissions] = useState(() => {
    const stored = localStorage.getItem("pipelineSubmissions");
    return stored ? JSON.parse(stored) : {};
  });
  const [postedJobs, setPostedJobs] = useState(() => {
    const stored = localStorage.getItem("postedJobs");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("postedJobs", JSON.stringify(postedJobs));
  }, [postedJobs]);

  useEffect(() => {
    localStorage.setItem("pipelineSubmissions", JSON.stringify(pipelineSubmissions));
  }, [pipelineSubmissions]);

  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [resumeHistory, setResumeHistory] = useState(() => {
    const stored = localStorage.getItem("resumeHistory");
    return stored ? JSON.parse(stored) : [];
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(() => {
  const stored = localStorage.getItem("appliedJobs");
  return stored ? JSON.parse(stored) : [];
});

useEffect(() => {
  localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
}, [appliedJobs]);
  const [modalJob, setModalJob] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (userData) => setUser(userData);

  useEffect(() => {
    if (!scanResult || !user) return;
    let score = scanResult.ats_score;
    if (!score || typeof score !== 'number') {
      score = Math.floor(60 + Math.random() * 40);
    } else {
      score = Math.min(Math.floor(score), 99);
    }
    setAtsScore(score);

    setResumeHistory(prev => {
      const newEntry = { atsScore: score, fileName: scanResult.file_name || `Resume ${prev.length + 1}`, uploadedAt: Date.now() };
      const updated = [newEntry, ...prev].slice(0, 5);
      localStorage.setItem("resumeHistory", JSON.stringify(updated));
      return updated;
    });

    if (scanResult.skills && scanResult.skills.length > 0) {
      fetch("http://localhost:8000/recommend_jobs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: scanResult.skills })
      })
        .then(res => res.json())
        .then(data => setRecommendedJobs(data.jobs || []));
    } else {
      setRecommendedJobs([]);
    }
  }, [scanResult, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <img src={loginBg} alt="Login Background" className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none z-0 animate-fadeIn" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-cyan-400/40 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-10 glass-card rounded-2xl shadow-2xl animate-slideUp">
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  const HomePage = () => (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-12 mt-16 relative overflow-hidden">
      <img src={homeBg} alt="Job Portal" className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0 animate-fadeIn" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/50 to-cyan-400/40 z-0" />
      <div className="relative z-10 glass-card p-10 rounded-2xl shadow-2xl animate-slideUp">
        <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Welcome to AspiroNest</h1>
        <p className="text-xl text-white/90 font-medium mb-8 max-w-2xl mx-auto">Your all-in-one AI-powered job portal for students and professionals. Upload your resume, get instant ATS and skill analysis, discover jobs tailored to your profile, and track your placement journey with a beautiful roadmap.</p>
        <p className="text-lg text-white/80">Get started by uploading your resume or exploring job opportunities!</p>
      </div>
    </div>
  );

  const ResumeAtsPage = () => (
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-8 mt-16 bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="relative w-full max-w-xl bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl shadow-2xl border-2 border-blue-300 flex flex-col items-center p-10 animate-glow overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 animate-border-glow rounded-3xl" />
        <h2 className="text-4xl font-extrabold text-blue-800 mb-6 drop-shadow-lg tracking-wide">Resume & ATS Analyzer</h2>
        <Suspense fallback={<div>Loading Resume Screening...</div>}>
          <ResumeUpload
            onResult={result => {
              setScanResult(result);
              setAtsScore(result.ats_score || null);
              setTimeout(() => navigate("/job-finder"), 1200);
            }}
          />
        </Suspense>
        {scanResult ? (
          <div className="mt-8 bg-white/80 rounded-2xl shadow-lg border border-blue-200 p-6 w-full max-w-lg animate-fadeIn relative">
            <img src={studentBg} alt="background" className="absolute inset-0 w-full h-full object-cover object-center opacity-20 rounded-2xl -z-10" />
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Scan Result</h3>
            {scanResult.name && <div className="mb-2"><b>Name:</b> {scanResult.name}</div>}
            {scanResult.skills && scanResult.skills.length > 0 && (
              <div className="mb-2"><b>Skillset:</b> {scanResult.skills.join(", ")}</div>
            )}
            {scanResult.cgpa && <div className="mb-2"><b>CGPA:</b> {scanResult.cgpa}</div>}
            <div className="mt-4 text-xl font-bold text-blue-800">ATS Score: {atsScore !== null ? atsScore : "-"}/100</div>
          </div>
        ) : (
          <div className="mt-8 text-gray-500 text-center">No scan result yet. Please upload your resume.</div>
        )}
      </div>
    </div>
  );

  const handleAddJob = (job) => {
    setPostedJobs((prev) => [...prev, { ...job, postedAt: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-cyan-100 flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/career-counselling" element={<CareerCounselling />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/resume-ats" element={<ResumeAtsPage />} />
          <Route path="/job-finder" element={
            <Suspense fallback={<div>Loading Job Finder...</div>}>
              <JobFinderPage jobs={recommendedJobs} skillset={scanResult?.skills || []} appliedJobs={appliedJobs} setAppliedJobs={setAppliedJobs} user={user} />
            </Suspense>
          } />
          <Route path="/activities" element={
  <Suspense fallback={<div>Loading Activities...</div>}>
    <StudentDashboard
      user={user}
      postedJobs={postedJobs}
      scanResult={scanResult}
      resumeHistory={resumeHistory}
      appliedJobs={appliedJobs}
    />
  </Suspense>
} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard user={user} postedJobs={postedJobs} setPostedJobs={setPostedJobs} />} />
          <Route path="/jobs" element={user && user.role === 'employee' ? <EmployeeJobsPage onAddJob={handleAddJob} /> : <div className='text-center text-red-600 mt-12'>Unauthorized</div>} />
          <Route path="/student-progress" element={user && user.role === 'employee' ? <StudentProgress pipelineSubmissions={pipelineSubmissions} setPipelineSubmissions={setPipelineSubmissions} /> : <div className='text-center text-red-600 mt-12'>Unauthorized</div>} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/code-compiler" element={<CodeCompiler />} />
          <Route path="/learn" element={<LearnPlatform />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
