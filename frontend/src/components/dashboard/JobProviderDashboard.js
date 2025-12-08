import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { API_URL } from '../../config';

export default function JobProviderDashboard({ user }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}/get_dashboard_analytics/`);
      const analytics = await response.json();
      
      // Transform backend data to match expected format
      const users = analytics.recent_users || [];
      const atsScores = [];
      const jobApps = analytics.recent_applications || [];
      
      setData({
        users: users,
        atsScores: atsScores,
        jobApps: jobApps,
        skills: [],
        exams: [],
        courses: [],
        analytics: analytics
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsersData = () => {
    if (data.analytics?.users_by_role) {
      return Object.entries(data.analytics.users_by_role).map(([name, value]) => ({ 
        name: name.replace('_', ' ').toUpperCase(), 
        value 
      }));
    }
    return [];
  };

  const getATSData = () => {
    const ranges = { 'Excellent (80+)': 0, 'Good (60-79)': 0, 'Average (40-59)': 0, 'Poor (0-39)': 0 };
    data.atsScores?.forEach(score => {
      const s = score.score || 0;
      if (s >= 80) ranges['Excellent (80+)']++;
      else if (s >= 60) ranges['Good (60-79)']++;
      else if (s >= 40) ranges['Average (40-59)']++;
      else ranges['Poor (0-39)']++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  };

  const getJobsData = () => {
    const status = {};
    data.jobApps?.forEach(app => {
      const s = app.status || 'Pending';
      status[s] = (status[s] || 0) + 1;
    });
    return Object.entries(status).map(([name, value]) => ({ name, value }));
  };

  const getSkillsData = () => {
    if (data.analytics?.skill_distribution) {
      return Object.entries(data.analytics.skill_distribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));
    }
    return [];
  };

  const getExamsData = () => {
    const status = { 'Enrolled': 0, 'Completed': 0, 'In Progress': 0 };
    data.exams?.forEach(exam => {
      const s = exam.status || 'Enrolled';
      if (status[s] !== undefined) status[s]++;
    });
    return Object.entries(status).map(([name, value]) => ({ name, value }));
  };

  const getCoursesData = () => {
    const categories = {};
    data.courses?.forEach(course => {
      const cat = course.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Job Provider Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{data.analytics?.total_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">ATS Scores</h3>
          <p className="text-2xl font-bold">{data.analytics?.total_ats_scores || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Applications</h3>
          <p className="text-2xl font-bold">{data.analytics?.total_applications || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Jobs</h3>
          <p className="text-2xl font-bold">{data.analytics?.total_jobs || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Users Enrolled</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getUsersData()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {getUsersData().map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ATS Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getATSData()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {getATSData().map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Jobs Applied</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getJobsData()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {getJobsData().map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Relevant Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSkillsData()}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Exams Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getExamsData()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {getExamsData().map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Courses Registered</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getCoursesData()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {getCoursesData().map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}