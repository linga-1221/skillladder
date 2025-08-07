import React from "react";

export default function JobModal({ job, onClose }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div className="glass-card p-8 max-w-lg w-full relative animate-slideUp">
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-gray-300 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold mb-3 text-blue-400">{job.title}</h2>
        <div className="mb-2 text-lg text-white/90 font-semibold">{job.company}</div>
        <div className="mb-2 text-sm text-blue-200">Location: {job.location || "Remote"}</div>
        <div className="mb-2 text-sm text-blue-200">Salary: <span className="font-bold">{job.salary || "Best in industry"}</span></div>
        <div className="mb-2 text-sm text-blue-200">Rounds: <span className="font-bold">{job.rounds || "3+"}</span></div>
        <div className="mb-4 text-white/80">{job.description}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {job.skills.map((skill, idx) => (
            <span key={idx} className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
              {skill}
            </span>
          ))}
        </div>
        <button className="glass-btn px-6 py-2 mt-2" onClick={() => {onClose(true);}}>Apply Now</button>
      </div>
    </div>
  );
}
