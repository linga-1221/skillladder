import React from "react";

export default function EmployeeDashboard({ user }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-900 py-12">
      <div className="glass-card max-w-3xl w-full p-8 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-blue-300 mb-4">Employee Dashboard</h2>
        <div className="mb-6 text-lg text-white/80">Welcome, <span className="font-semibold text-blue-100">{user.email}</span>!</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Posting Card */}
          <div className="glass p-6 rounded-2xl shadow-lg animate-slideUp">
            <h3 className="text-xl font-bold text-blue-200 mb-2">Post a New Job</h3>
            <input className="w-full mb-2 p-2 rounded bg-gray-800/60 text-white" placeholder="Job Title" />
            <input className="w-full mb-2 p-2 rounded bg-gray-800/60 text-white" placeholder="Company" />
            <textarea className="w-full mb-2 p-2 rounded bg-gray-800/60 text-white" placeholder="Job Description" rows={3} />
            <button className="glass-btn px-4 py-2 mt-2 w-full">Post Job</button>
          </div>
          {/* Candidate Review Card */}
          <div className="glass p-6 rounded-2xl shadow-lg animate-slideUp">
            <h3 className="text-xl font-bold text-blue-200 mb-2">Review Candidates</h3>
            <div className="text-white/70 mb-2">AI-matched candidates will appear here.</div>
            <div className="flex flex-col gap-2">
              <div className="bg-blue-900/60 p-3 rounded text-white/90 animate-fadeIn">No candidates yet.</div>
            </div>
          </div>
        </div>
        {/* AI Matching Section */}
        <div className="glass p-6 rounded-2xl shadow-lg mt-8 animate-fadeIn">
          <h3 className="text-xl font-bold text-blue-200 mb-2">AI-Based Candidate Matching</h3>
          <div className="text-white/70">This section will show candidates recommended by AI based on job requirements and skills.</div>
        </div>
      </div>
    </div>
  );
}
