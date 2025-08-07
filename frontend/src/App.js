import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import JobModal from "./components/JobModal";
import "./darkGlass.css";
import homeBg from './images/home.jpg';
import loginBg from './images/login.jpg';
import studentBg from './images/student.jpg';
import employeeBg from './images/employee.jpg';

const ResumeUpload = React.lazy(() => import("./components/ResumeUpload"));
const JobSuggestions = React.lazy(() => import("./components/JobSuggestions"));
const CareerGuidance = React.lazy(() => import("./components/CareerGuidance"));
const UserHistory = React.lazy(() => import("./components/dashboard/UserHistory"));
const EmployeeDashboard = React.lazy(() => import("./components/dashboard/EmployeeDashboard"));

function App() {
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogin = (userData) => setUser(userData);

  useEffect(() => {
    if (!scanResult || !user) return;
    setAtsScore(scanResult.ats_score || null);

    // Fetch recommended jobs from backend
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


  // Home Page content
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

  // Resume & ATS Page
  const ResumeAtsPage = () => (
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-8 mt-16">
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Resume & ATS Analyzer</h2>
        <Suspense fallback={<div>Loading Resume Screening...</div>}>
          <ResumeUpload
            onResult={result => {
              setScanResult(result);
              setAtsScore(result.ats_score || null);
              // After scan, redirect to job finder
              setTimeout(() => navigate("/job-finder"), 1200);
            }}
          />
        </Suspense>
        {scanResult && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Resume Scan Result</h3>
            <div className="mb-2"><b>Skills:</b> {scanResult.skills && scanResult.skills.length > 0 ? scanResult.skills.join(", ") : "None detected"}</div>
            <div className="mb-2"><b>Work Experience:</b> <pre className="inline bg-gray-100 p-2 rounded">{scanResult.work_experience || "None detected"}</pre></div>
            <div className="mb-2"><b>CGPA:</b> {scanResult.cgpa || "-"} <b>Marks:</b> {scanResult.marks || "-"}</div>
            <div className="mb-2"><b>ATS Score:</b> {atsScore !== null ? atsScore : "-"}/100</div>
          </div>
        )}
      </div>
    </div>
  );

  // Job Finder Page
  const JobFinderPage = () => {
    // Show 3-4 skill-matched jobs, rest random
    let skillMatched = [];
    let randomJobs = [];
    if (scanResult && scanResult.skills && recommendedJobs.length > 0) {
      skillMatched = recommendedJobs.slice(0, 4);
      randomJobs = recommendedJobs.slice(4, 10);
    }
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 mt-16">
        <div className="w-full max-w-4xl glass-card p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Job Finder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillMatched.map((job, idx) => (
              <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow hover:scale-105 transition-transform cursor-pointer glass-card animate-fadeIn"
                onClick={() => setModalJob(job)}>
                <h3 className="text-xl font-semibold text-blue-800 mb-1">{job.title}</h3>
                <div className="text-gray-700 mb-1">Company: <b>{job.company}</b></div>
                <div className="text-gray-600 text-sm mb-2">Skills: {job.skills.join(", ")}</div>
                <div className="text-gray-700 text-sm">Rounds: {job.rounds || "3+"}</div>
                <div className="text-green-700 font-semibold">Salary: {job.salary || "Best in industry"}</div>
                <button className="mt-3 px-4 py-2 glass-btn" onClick={e => {
                  e.stopPropagation();
                  setAppliedJobs(jobs => [...jobs, { ...job, appliedAt: new Date().toISOString() }]);
                  setModalJob(null);
                  alert("Applied to " + job.title + " at " + job.company);
                }}>Apply</button>
              </div>
            ))}
            {randomJobs.map((job, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                <div className="text-gray-700 mb-1">Company: <b>{job.company}</b></div>
                <div className="text-gray-600 text-sm mb-2">Skills: {job.skills.join(", ")}</div>
                <div className="text-gray-700 text-sm">Rounds: {job.rounds || "3+"}</div>
                <div className="text-green-700 font-semibold">Salary: {job.salary || "Best in industry"}</div>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700" onClick={() => {
                  setAppliedJobs(jobs => [...jobs, { ...job, appliedAt: new Date().toISOString() }]);
                  alert("Applied to " + job.title + " at " + job.company);
                }}>Apply</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Activities/Roadmap Page
  const ActivitiesPage = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 mt-16">
      <div className="w-full max-w-3xl bg-white/95 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">My Placement Roadmap</h2>
        {appliedJobs.length === 0 ? (
          <div className="text-gray-500">You haven't applied to any jobs yet. Apply from the Job Finder page!</div>
        ) : (
          <ol className="relative border-l-4 border-blue-400 ml-6">
            {appliedJobs.map((job, idx) => (
              <li key={idx} className="mb-8 ml-4">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-5 top-2 border-2 border-white"></div>
                <div className="text-lg font-semibold text-blue-800">{job.title} @ {job.company}</div>
                <div className="text-gray-700 text-sm">Applied: {new Date(job.appliedAt).toLocaleDateString()} | Rounds: {job.rounds || "3+"} | Salary: {job.salary || "Best in industry"}</div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-cyan-100 flex flex-col">
      <Navbar user={user} />
      <button
        className="fixed top-5 right-6 z-50 glass-btn px-4 py-2 font-semibold text-base shadow-lg"
        onClick={() => setDarkMode(dm => !dm)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume-ats" element={<ResumeAtsPage />} />
          <Route path="/job-finder" element={<>
            <JobFinderPage />
            <JobModal job={modalJob} onClose={() => setModalJob(null)} />
          </>} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
