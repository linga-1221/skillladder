import React from "react";

export default function PieChart({ total, label }) {
  // For now, just a static SVG pie with total in center
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="#e0e7ff" stroke="#3b82f6" strokeWidth="8" />
        <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fontSize="2.2em" fill="#2563eb" fontWeight="bold">{total}</text>
      </svg>
      <div className="mt-2 text-blue-800 font-semibold text-lg">{label}</div>
    </div>
  );
}
