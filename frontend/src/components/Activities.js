import React, { useState } from 'react';

export default function Activities({ user }) {
  const [activeTab, setActiveTab] = useState('applied-jobs');
  const [mockTest, setMockTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [isProctored, setIsProctored] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState([
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', appliedDate: '2024-01-15', status: 'Under Review' },
    { id: 2, title: 'Python Developer', company: 'DataLabs', appliedDate: '2024-01-10', status: 'Interview Scheduled' },
    { id: 3, title: 'Full Stack Developer', company: 'StartupXYZ', appliedDate: '2024-01-08', status: 'Rejected' }
  ]);

  // Proctored Test Functions
  const startProctoredTest = async (subject = 'programming', difficulty = 'medium') => {
    try {
      // Request camera and microphone permissions
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      setIsProctored(true);
      
      // Start recording
      const recorder = new MediaRecorder(mediaStream);
      setMediaRecorder(recorder);
      recorder.start();
      
      const response = await fetch('http://localhost:8000/get_mock_test/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, difficulty })
      });

      const data = await response.json();
      if (data.questions) {
        setMockTest(data);
        setCurrentQuestion(0);
        setAnswers([]);
        setTestResult(null);
        setTimeLeft(data.time_limit * 60); // Convert minutes to seconds
        
        // Start timer
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              submitTest();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to start proctored test:', error);
      alert('Camera and microphone access is required for proctored tests.');
    }
  };
  
  const stopProctoring = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setIsProctored(false);
  };

  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    try {
      stopProctoring();
      
      const correctAnswers = mockTest.questions.map(q => q.correct);
      const response = await fetch('http://localhost:8000/submit_mock_test/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answers,
          correct_answers: correctAnswers
        })
      });

      const result = await response.json();
      setTestResult(result);
      setMockTest(null);
      setTimeLeft(0);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Activities & Practice
          </h1>
          <p className="text-gray-600 text-lg">
            Test your skills and get career guidance to accelerate your growth
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-2 mb-8 shadow-xl">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('applied-jobs')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'applied-jobs'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Applied Jobs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mocktest')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'mocktest'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Proctored Tests
              </div>
            </button>
          </div>
        </div>

        {/* Applied Jobs Tab */}
        {activeTab === 'applied-jobs' && (
          <div className="space-y-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Applied Jobs</h2>
              
              {appliedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">Start applying to jobs to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedJobs.map((job) => (
                    <div key={job.id} className="bg-white/50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          job.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0013.5 21h-3A2 2 0 018.5 15.5L8 7z" />
                        </svg>
                        Applied on {job.appliedDate}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          Withdraw Application
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proctored Mock Test Tab */}
        {activeTab === 'mocktest' && (
          <div className="space-y-6">
            {!mockTest && !testResult && (
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Proctored Mock Tests</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-yellow-800">Proctored Test Requirements</h3>
                      <p className="text-sm text-yellow-700">Camera and microphone access required. Your session will be monitored.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                       onClick={() => startProctoredTest('programming', 'easy')}>
                    <div className="text-center">
                      <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Programming Basics</h3>
                      <p className="text-gray-600 mb-4">Test your fundamental programming knowledge</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Difficulty: Easy</span>
                        <span>Questions: 5</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                       onClick={() => startProctoredTest('programming', 'medium')}>
                    <div className="text-center">
                      <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Data Structures & Algorithms</h3>
                      <p className="text-gray-600 mb-4">Advanced programming concepts and problem-solving</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Difficulty: Medium</span>
                        <span>Questions: 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mockTest && (
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Proctored Mock Test</h2>
                  <div className="flex items-center space-x-4">
                    <div className={`text-lg font-bold ${
                      timeLeft < 300 ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      ⏰ {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {mockTest.questions.length}
                    </div>
                  </div>
                </div>
                
                {/* Proctoring Video */}
                {isProctored && stream && (
                  <div className="fixed top-4 right-4 z-50">
                    <div className="bg-white rounded-lg p-2 shadow-2xl border-2 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-red-600">🔴 RECORDING</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <video
                        ref={(video) => {
                          if (video && stream) {
                            video.srcObject = stream;
                            video.play();
                          }
                        }}
                        className="w-32 h-24 bg-gray-900 rounded"
                        muted
                        autoPlay
                      />
                    </div>
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / mockTest.questions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {mockTest.questions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {mockTest.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                          answers[currentQuestion] === index
                            ? 'border-orange-500 bg-orange-50 text-orange-800'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[currentQuestion] === index
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          {option}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === undefined}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === mockTest.questions.length - 1 ? 'Submit Test' : 'Next'}
                  </button>
                </div>
              </div>
            )}

            {testResult && (
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Results</h2>
                  <div className={`text-6xl font-bold mb-4 ${
                    testResult.percentage >= 80 ? 'text-green-600' :
                    testResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {testResult.percentage}%
                  </div>
                  <p className="text-xl text-gray-600 mb-2">
                    {testResult.score} out of {testResult.total} correct
                  </p>
                  <p className={`text-lg font-semibold ${
                    testResult.percentage >= 80 ? 'text-green-600' :
                    testResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {testResult.performance}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {testResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-blue-700">
                        <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setTestResult(null)}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700"
                  >
                    Take Another Test
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}