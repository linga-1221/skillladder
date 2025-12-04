import React, { useState, useEffect } from 'react';

export default function LearnPlatform({ user }) {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    target_role: 'Full Stack Developer',
    experience: 'beginner',
    skills: []
  });
  const [completedSkills, setCompletedSkills] = useState(new Set());

  const targetRoles = [
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Cloud Architect'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'advanced', label: 'Advanced (3+ years)' }
  ];

  const generateLearningPath = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate_learning_path/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();
      if (data.learning_path) {
        setLearningPath(data);
      }
    } catch (error) {
      console.error('Failed to generate learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkillCompletion = (skill) => {
    setCompletedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skill)) {
        newSet.delete(skill);
      } else {
        newSet.add(skill);
      }
      return newSet;
    });
  };

  const getProgressPercentage = () => {
    if (!learningPath) return 0;
    const totalSkills = learningPath.learning_path.length;
    const completed = learningPath.learning_path.filter(item => 
      completedSkills.has(item.skill)
    ).length;
    return totalSkills > 0 ? (completed / totalSkills) * 100 : 0;
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Learning Platform
          </h1>
          <p className="text-gray-600 text-lg">
            Get personalized learning paths tailored to your career goals
          </p>
        </div>

        {/* Preferences Section */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Your Learning Goals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <select
                value={preferences.target_role}
                onChange={(e) => setPreferences(prev => ({ ...prev, target_role: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {targetRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={preferences.experience}
                onChange={(e) => setPreferences(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Skills (comma-separated)</label>
            <input
              type="text"
              value={preferences.skills.join(', ')}
              onChange={(e) => {
                const value = e.target.value;
                const skillsArray = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];
                setPreferences(prev => ({ 
                  ...prev, 
                  skills: skillsArray
                }));
              }}
              onKeyDown={(e) => {
                // Allow comma input
                if (e.key === ',') {
                  e.stopPropagation();
                }
              }}
              placeholder="e.g., JavaScript, Python, React"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Separate skills with commas (e.g., Python, JavaScript, React)</p>
          </div>

          <button
            onClick={generateLearningPath}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Path...
              </div>
            ) : (
              'Generate Learning Path'
            )}
          </button>
        </div>

        {/* Learning Path Results */}
        {learningPath && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Learning Progress</h3>
                <span className="text-2xl font-bold text-indigo-600">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{learningPath.completion_time}</div>
                  <div className="text-gray-600">Estimated Time</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{learningPath.progress?.completed || 0}</div>
                  <div className="text-gray-600">Skills Mastered</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{learningPath.progress?.remaining || 0}</div>
                  <div className="text-gray-600">Skills Remaining</div>
                </div>
              </div>
            </div>

            {/* Learning Path Timeline */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Your Learning Roadmap</h3>
              
              <div className="space-y-4">
                {learningPath.learning_path.map((item, index) => {
                  const isCompleted = completedSkills.has(item.skill);
                  const isCurrent = !isCompleted && index === 0;
                  
                  return (
                    <div key={index} className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : isCurrent 
                        ? 'bg-blue-50 border-blue-200 shadow-lg' 
                        : 'bg-white/50 border-gray-200'
                    }`}>
                      {/* Timeline connector */}
                      {index < learningPath.learning_path.length - 1 && (
                        <div className={`absolute left-6 top-16 w-0.5 h-8 ${
                          isCompleted ? 'bg-green-400' : 'bg-gray-300'
                        }`}></div>
                      )}
                      
                      {/* Status indicator */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                          ? 'bg-blue-500 text-white animate-pulse' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="font-bold">{item.week}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-lg font-semibold ${
                            isCompleted ? 'text-green-800' : isCurrent ? 'text-blue-800' : 'text-gray-800'
                          }`}>
                            {item.skill}
                          </h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            isCompleted 
                              ? 'bg-green-200 text-green-800' 
                              : isCurrent 
                              ? 'bg-blue-200 text-blue-800' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            Week {item.week}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">Duration: {item.duration}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.resources.map((resource, idx) => (
                            <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                              {resource}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => toggleSkillCompletion(item.skill)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            isCompleted
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-indigo-500 text-white hover:bg-indigo-600'
                          }`}
                        >
                          {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Steps */}
            {learningPath.next_skills && learningPath.next_skills.length > 0 && (
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Next Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {learningPath.next_skills.map((skill, index) => (
                    <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-indigo-800 mb-2">{skill}</div>
                      <div className="text-sm text-indigo-600">High Priority</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Resources */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Recommended Learning Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Online Courses</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Coursera</li>
                <li>• Udemy</li>
                <li>• edX</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Practice Platforms</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LeetCode</li>
                <li>• HackerRank</li>
                <li>• Codewars</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Documentation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• MDN Web Docs</li>
                <li>• Python.org</li>
                <li>• React Docs</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Communities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stack Overflow</li>
                <li>• GitHub</li>
                <li>• Reddit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}