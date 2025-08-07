import React from "react";
import { Link, useLocation } from "react-router-dom";
import homeBg from '../images/home.jpg';
import loginBg from '../images/login.jpg';
import studentBg from '../images/student.jpg';
import employeeBg from '../images/employee.jpg';

export default function Navbar({ user }) {
  const location = useLocation();
  // Determine background image based on route and role
  let bgImage = homeBg;
  if (location.pathname.startsWith('/login')) bgImage = loginBg;
  if (user && user.role === 'student') bgImage = studentBg;
  if (user && user.role === 'employee') bgImage = employeeBg;

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-10">
        <img src={bgImage} alt="background" className="w-full h-full object-cover object-center animate-fadeIn" style={{filter: 'blur(8px) brightness(0.85)'}} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-700/50 to-cyan-400/40" />
      </div>
      <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 p-4 shadow-lg flex items-center justify-between glass-navbar sticky top-0 z-40 animate-navbarFade">
        <div className="flex items-center space-x-4">
          <img src={homeBg} alt="logo" className="w-12 h-12 rounded-full shadow-lg" />
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">AspiroNest</span>
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Home</Link>
          {(user && user.role === "student") && (
            <>
              <Link to="/resume-ats" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/resume-ats" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Resume & ATS</Link>
              <Link to="/job-finder" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/job-finder" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Job Finder</Link>
              <Link to="/activities" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/activities" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Activities</Link>
            </>
          )}
          {(user && user.role === "employee") && (
            <>
              <Link to="/employee-home" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/employee-home" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Home</Link>
              <Link to="/student-progress" className={`text-lg font-semibold transition-colors duration-200 ${location.pathname === "/student-progress" ? "text-yellow-300" : "text-white hover:text-yellow-300"}`}>Student Progress</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {user && <span className="text-white font-medium">{user.email}</span>}
        </div>
      </nav>
    </>
  );
}
