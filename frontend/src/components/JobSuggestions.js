import React from "react";

const JOBS_DB = [
  {
    title: "Python Developer",
    skills: ["python", "django", "flask"],
    company: "TechNova",
    location: "Remote",
    description: "Build scalable backend services using Python."
  },
  {
    title: "Frontend Engineer",
    skills: ["react", "javascript", "css", "html"],
    company: "WebWorks",
    location: "Bangalore, India",
    description: "Develop modern web interfaces with React."
  },
  {
    title: "Data Analyst",
    skills: ["excel", "sql", "data analysis", "powerbi"],
    company: "InsightX",
    location: "Hyderabad, India",
    description: "Analyze business data and generate reports."
  },
  {
    title: "Machine Learning Engineer",
    skills: ["python", "machine learning", "tensorflow", "pytorch"],
    company: "AI Labs",
    location: "Remote",
    description: "Build ML models and deploy solutions."
  },
  {
    title: "DevOps Engineer",
    skills: ["aws", "docker", "kubernetes", "git"],
    company: "CloudOps",
    location: "Chennai, India",
    description: "Manage CI/CD pipelines and cloud infrastructure."
  },
  // ... add more sample jobs as needed
];

export default function JobSuggestions({ skills }) {
  if (!skills || skills.length === 0) return null;
  // Suggest jobs where at least one skill matches
  const suggested = JOBS_DB.filter(job => job.skills.some(skill => skills.includes(skill)));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-8">
      <h2 className="text-2xl font-semibold mb-2 text-blue-700">Job Suggestions</h2>
      {suggested.length === 0 ? (
        <p className="text-gray-600">No matching jobs found for your skills.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {suggested.map((job, idx) => (
            <li key={idx} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-blue-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company} &mdash; {job.location}</p>
                  <p className="text-gray-700 text-sm mt-1">{job.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map((skill, sidx) => (
                      <span key={sidx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
