import React from "react";

export default function StudentDashboard({ user, scanResult, onScan, jobSuggestions, careerGuidance, userHistorySection }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Student Dashboard</h2>
      <div className="mb-4 text-gray-700">Welcome, <span className="font-semibold">{user.email}</span>!</div>
      {onScan}
      {scanResult}
      {jobSuggestions}
      {careerGuidance}
      <div className="mt-8">{userHistorySection}</div>
    </div>
  );
}
