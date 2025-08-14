import React, { useState } from "react";

export default function JobFinderPage({ jobs = [], skillset = [], appliedJobs = [], setAppliedJobs, user }) {
  const [modalJob, setModalJob] = useState(null);
  const [appliedJobId, setAppliedJobId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const isJobApplied = (job) => {
  if (!user) return false;
  return appliedJobs.some(
    (aj) => aj.jobId === job.title + job.company && aj.userEmail === user.email
  );
};
  const matchedJobs = jobs
    .filter(job => job.skills && job.skills.some(skill => skillset.includes(skill)))
    .slice(0, 10);
  const otherJobs = jobs.filter(job => !job.skills || !job.skills.some(skill => skillset.includes(skill)));
  let displayJobs = [...matchedJobs, ...otherJobs.filter(job => !matchedJobs.includes(job))];
  if (displayJobs.length < 20 && jobs.length >= 20) {
    displayJobs = jobs.slice(0, 20);
  } else {
    displayJobs = displayJobs.slice(0, 20);
  }

  // Advanced filter/sort state
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Extract unique locations and skills for filter dropdowns
  const allLocations = Array.from(new Set(jobs.map(j => j.location))).sort();
  const allSkills = Array.from(new Set(jobs.flatMap(j => j.skills || []))).sort();

  // Parse salary string to number for range filtering
  function parseSalary(sal) {
    if (!sal) return [0, 0];
    const match = sal.replace(/[^\d-]/g, "").split("-");
    return match.length === 2 ? [+match[0], +match[1]] : [+match[0], +match[0]];
  }

  // Filter jobs
  let filteredJobs = displayJobs.filter(job => {
    const searchLower = search.toLowerCase();
    const [salaryMin, salaryMax] = parseSalary(job.salary);
    return (
      (!location || job.location === location) &&
      (minSalary <= salaryMin && maxSalary >= salaryMax) &&
      (selectedSkills.length === 0 || selectedSkills.every(skill => job.skills && job.skills.includes(skill))) &&
      (
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        (job.skills && job.skills.join(" ").toLowerCase().includes(searchLower))
      )
    );
  });

  // Sort jobs
  if (sortBy === "salary") {
    filteredJobs.sort((a, b) => (parseSalary(b.salary)[0] || 0) - (parseSalary(a.salary)[0] || 0));
  } else if (sortBy === "title") {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "company") {
    filteredJobs.sort((a, b) => a.company.localeCompare(b.company));
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-2 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400">
        <div className="w-full max-w-7xl">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Job Finder</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <input
              type="text"
              placeholder="Search jobs by title, company, or skill..."
              className="flex-1 min-w-[180px] max-w-xs p-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="p-3 border border-blue-200 rounded-lg min-w-[140px]"
              value={location}
              onChange={e => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {allLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <div className="flex flex-col min-w-[120px] max-w-[120px]">
              <label className="text-xs text-gray-500 mb-1">Min Salary (LPA)</label>
              <input type="number" min={0} max={maxSalary} value={minSalary} onChange={e => setMinSalary(Number(e.target.value))} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col min-w-[120px] max-w-[120px]">
              <label className="text-xs text-gray-500 mb-1">Max Salary (LPA)</label>
              <input type="number" min={minSalary} max={100} value={maxSalary} onChange={e => setMaxSalary(Number(e.target.value))} className="p-2 border rounded" />
            </div>
            <select
              multiple
              className="p-3 border border-blue-200 rounded-lg min-w-[120px] h-[70px]"
              value={selectedSkills}
              onChange={e => setSelectedSkills(Array.from(e.target.selectedOptions, o => o.value))}
            >
              {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
            </select>
            <select
              className="p-3 border border-blue-200 rounded-lg min-w-[120px]"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="title">Job Title (A-Z)</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>

          {/* Job List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {filteredJobs.map((job, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl p-7 relative border border-blue-200 flex flex-col justify-between min-w-[300px] max-w-[370px] mx-auto hover:scale-[1.025] transition-transform duration-200">
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-1">{job.title}</h3>
                  <div className="text-gray-600 mb-1"><b>Company:</b> {job.company}</div>
                  <div className="text-gray-600 mb-1"><b>Location:</b> {job.location || "Remote"}</div>
                  <div className="text-green-700 font-bold mb-1"><b>Salary:</b> {job.salary || "Best in industry"}</div>
                  <div className="mb-2 text-gray-700 text-sm"><b>Description:</b> {job.description}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.skills && job.skills.map((skill, sidx) => (
                      <span key={sidx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => setModalJob(job)}
                  disabled={isJobApplied(job)}
                >
                  {isJobApplied(job) ? "Applied" : "Apply"}
                </button>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="col-span-3 text-center text-gray-500">No jobs found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div className="glass-card p-8 max-w-lg w-full relative animate-slideUp">
            <button onClick={() => setModalJob(null)} className="absolute top-3 right-3 text-xl text-gray-300 hover:text-white">&times;</button>
            <h2 className="text-2xl font-bold mb-3 text-blue-400">{modalJob.title}</h2>
            <div className="mb-2 text-lg text-blue-900 font-semibold">{modalJob.company}</div>
            <div className="mb-2 text-sm text-blue-600">Location: {modalJob.location || "Remote"}</div>
            <div className="mb-2 text-sm text-blue-600">Salary: <span className="font-bold">{modalJob.salary || "Best in industry"}</span></div>
            <div className="mb-4 text-gray-700">{modalJob.description}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {modalJob.skills && modalJob.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {skill}
                </span>
              ))}
            </div>
            <button
              className="glass-btn px-6 py-2 mt-2"
              onClick={() => {
                setAppliedJobs((prev) => [
                  ...prev,
                  {
                    jobId: modalJob.title + modalJob.company,
                    jobTitle: modalJob.title,
                    company: modalJob.company,
                    appliedAt: Date.now(),
                    userEmail: user?.email || ""
                  }
                ]);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
                setModalJob(null);
              }}
              disabled={isJobApplied(modalJob)}
            >
              {isJobApplied(modalJob) ? "Applied" : "Apply Now"}
            </button>
            {modalJob.website && (
              <a href={modalJob.website} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-500 hover:underline">
                Visit Company Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Alert */}
      {showAlert && (
        <div className="fixed top-8 right-8 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fadeIn">
          Successfully applied for the job!
        </div>
      )}
    </>
  );
}
