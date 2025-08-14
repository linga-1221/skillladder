import React, { useState, useEffect, useRef } from "react";
import CodeRunner from "./CodeRunner";

// Company-specific question banks for distinct mock tests
const COMPANY_QUESTIONS = {
  IBM: [
    { q: "What is IBM's flagship AI platform?", a: "Watson", type: "short" },
    { q: "Which programming language is primarily used for IBM mainframes?", a: "COBOL", type: "mcq", options: ["Java", "COBOL", "Python", "C++"] },
    { q: "What does IBM stand for?", a: "International Business Machines", type: "short" },
    { q: "IBM's cloud platform is called?", a: "IBM Cloud", type: "mcq", options: ["AWS", "Azure", "IBM Cloud", "Google Cloud"] },
    { q: "What is the time complexity of merge sort?", a: "O(n log n)", type: "short" },
    { q: "Python: What does the 'with' statement do?", a: "It simplifies exception handling by encapsulating common preparation and cleanup tasks.", type: "short" },
    { q: "What is memoization in dynamic programming?", a: "Caching results of expensive function calls", type: "short" },
    { q: "Which data structure is best for implementing a priority queue?", a: "Heap", type: "mcq", options: ["Array", "Linked List", "Heap", "Stack"] }
  ],
  Google: [
    { q: "What is Google's mobile operating system?", a: "Android", type: "short" },
    { q: "Which programming language was developed by Google?", a: "Go", type: "mcq", options: ["Python", "Java", "Go", "JavaScript"] },
    { q: "What is Google's cloud platform called?", a: "Google Cloud Platform", type: "short" },
    { q: "What does GCP stand for?", a: "Google Cloud Platform", type: "short" },
    { q: "What is the output of: System.out.println(1 + 2 + \"3\"); in Java?", a: "33", type: "short" },
    { q: "Which data structure is used for BFS traversal?", a: "Queue", type: "mcq", options: ["Stack", "Queue", "Tree", "Heap"] },
    { q: "What is the complexity of Dijkstra's algorithm using a min-heap?", a: "O((V+E) log V)", type: "short" },
    { q: "What is the main advantage of a trie over a hash table?", a: "Efficient prefix search", type: "short" }
  ],
  Amazon: [
    { q: "What is Amazon's cloud service called?", a: "AWS", type: "short" },
    { q: "Which programming language is commonly used for Amazon's backend services?", a: "Java", type: "mcq", options: ["Python", "Java", "C++", "Ruby"] },
    { q: "What does AWS stand for?", a: "Amazon Web Services", type: "short" },
    { q: "Amazon's virtual assistant is called?", a: "Alexa", type: "short" },
    { q: "What is the maximum subarray sum problem called?", a: "Kadane's Algorithm", type: "short" },
    { q: "What does CAP theorem stand for?", a: "Consistency, Availability, Partition tolerance", type: "short" },
    { q: "Which sorting algorithm is stable?", a: "Merge sort", type: "mcq", options: ["Heap sort", "Quick sort", "Merge sort", "Selection sort"] },
    { q: "What is a lambda function in Python?", a: "An anonymous function", type: "short" }
  ],
  Microsoft: [
    { q: "What is Microsoft's cloud platform?", a: "Azure", type: "short" },
    { q: "Which programming language was developed by Microsoft?", a: "C#", type: "mcq", options: ["Java", "Python", "C#", "Go"] },
    { q: "What is Microsoft's productivity suite called?", a: "Office 365", type: "short" },
    { q: "Microsoft's database management system is?", a: "SQL Server", type: "mcq", options: ["MySQL", "PostgreSQL", "SQL Server", "Oracle"] },
    { q: "What is the .NET framework?", a: "A software development platform", type: "short" },
    { q: "Which design pattern ensures a class has only one instance?", a: "Singleton", type: "short" },
    { q: "What is polymorphism in OOP?", a: "The ability of objects to take multiple forms", type: "short" },
    { q: "Time complexity of binary search?", a: "O(log n)", type: "mcq", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"] }
  ]
};

const APTITUDE_QUESTIONS = [
  { q: "What is 12 * 8?", a: "96", type: "short" },
  { q: "If a train travels 60km in 1.5 hours, what is its speed? (km/h)", a: "40", type: "short" },
  { q: "Find the next number: 2, 6, 12, 20, ...", a: "30", type: "short" },
  { q: "Which of the following is a prime number?", a: "13", type: "mcq", options: ["12", "13", "14", "15"] },
  { q: "The sum of angles in a triangle is?", a: "180", type: "mcq", options: ["90", "180", "270", "360"] },
  { q: "The sky is blue. True or False?", a: "True", type: "tf" },
  { q: "If 5x = 20, what is x?", a: "4", type: "short" },
  { q: "What is the average of 10, 20, 30, 40, 50?", a: "30", type: "short" },
];

const PROGRAMMING_QUESTIONS = [
  { q: "What does '===' mean in JavaScript?", a: "strict equality", type: "short" },
  { q: "What is the output of: print(len('hello')) in Python?", a: "5", type: "short" },
  { q: "Which data structure uses FIFO?", a: "queue", type: "mcq", options: ["stack", "queue", "tree", "graph"] },
  { q: "What is the time complexity of binary search?", a: "O(log n)", type: "mcq", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"] },
  { q: "What keyword is used to define a function in Python?", a: "def", type: "short" },
  { q: "HTML stands for HyperText Markup Language. True or False?", a: "True", type: "tf" },
];

function getRandomQuestions(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function ProcturedExam() {
  // Get exam data from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const company = urlParams.get('company') || 'General';
  const jobTitle = urlParams.get('jobTitle') || 'Position';
  const userEmail = urlParams.get('userEmail') || '';

  // Permission states
  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  // Video stream
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Exam states
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Questions
  const [questions, setQuestions] = useState([]);

  // Initialize company-specific questions
  useEffect(() => {
    let companyQs = [];
    if (company && COMPANY_QUESTIONS[company]) {
      companyQs = COMPANY_QUESTIONS[company];
    } else {
      // Default questions if company not found
      companyQs = [
        ...APTITUDE_QUESTIONS.slice(0, 4),
        ...PROGRAMMING_QUESTIONS.slice(0, 4)
      ];
    }
    
    // Get 5 random questions from company-specific set
    const selectedQuestions = getRandomQuestions(companyQs, 5);
    setQuestions(selectedQuestions.map(q => ({ ...q, typeGroup: 'company' })));
  }, [company]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-move to next question when time runs out
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
            return 60;
          } else {
            // Auto-submit if it's the last question
            handleSubmitExam();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, submitted, currentQuestion, questions.length]);

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    setIsRequestingPermissions(true);
    setPermissionError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasPermissions(true);
      setPermissionError('');
    } catch (error) {
      console.error('Permission denied:', error);
      setPermissionError('Camera and microphone access is required to start the exam. Please allow permissions and try again.');
      setHasPermissions(false);
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  // Start mock test
  const startExam = () => {
    if (!hasPermissions) {
      setPermissionError('Please grant camera and microphone permissions first.');
      return;
    }
    setExamStarted(true);
    setTimeLeft(60);
  };

  // Handle answer change
  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setTimeLeft(60);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
      setTimeLeft(60);
    }
  };

  // Submit mock test
  const handleSubmitExam = () => {
    setSubmitted(true);
    
    // Clean up video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Send results to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'MOCK_TEST_COMPLETED',
        data: {
          company,
          jobTitle,
          userEmail,
          answers,
          completedAt: new Date().toISOString()
        }
      }, '*');
    }

    // Auto-close after 3 seconds
    setTimeout(() => {
      window.close();
    }, 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

    // Prevent tab close/refresh during mock test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examStarted && !submitted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your mock test progress will be lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStarted, submitted]);

  if (!hasPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Proctored Mock Test</h1>
            <p className="text-gray-600 mb-4">{jobTitle} @ {company}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">
              This mock test requires camera and microphone access for proctoring purposes. 
              Your video will be monitored during the test to ensure integrity.
            </p>
            {permissionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{permissionError}</p>
              </div>
            )}
          </div>

          <button
            onClick={requestPermissions}
            disabled={isRequestingPermissions}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRequestingPermissions ? 'Requesting Permissions...' : 'Grant Camera & Microphone Access'}
          </button>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Ready to Start Mock Test</h1>
            <p className="text-gray-600 mb-4">{jobTitle} @ {company}</p>
          </div>

          <div className="mb-6">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-32 bg-gray-200 rounded-lg object-cover"
            />
            <p className="text-sm text-gray-600 mt-2">Camera is active and ready</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Mock Test Instructions:</h3>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• {questions.length} questions total</li>
              <li>• 60 seconds per question</li>
              <li>• Red timer warning in last 10 seconds</li>
              <li>• Auto-submit when time runs out</li>
              <li>• Do not close this tab during mock test</li>
            </ul>
          </div>

          <button
            onClick={startExam}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start Mock Test
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mock Test Completed!</h1>
          <p className="text-gray-600 mb-4">Your answers have been submitted successfully.</p>
          <p className="text-sm text-gray-500">This window will close automatically in a few seconds.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Header with timer and video */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{company} Mock Test</h1>
            <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
              timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'
            }`}>
              {timeLeft}s
            </div>
            
            {/* Video feed - Made more prominent */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-600 mb-1">Live Monitoring</p>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-32 h-24 bg-gray-200 rounded-lg object-cover border-2 border-blue-300 shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentQ.q}
          </h2>

          {/* Answer input based on question type */}
          {currentQ.type === 'mcq' ? (
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : currentQ.type === 'tf' ? (
            <div className="flex gap-4">
              {['True', 'False'].map(option => (
                <label key={option} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your answer..."
              />
              {currentQ.typeGroup === 'programming' && (
                <div className="mt-4">
                  <CodeRunner lang={
                    currentQ.q.toLowerCase().includes('python') ? 'python' :
                    currentQ.q.toLowerCase().includes('java') ? 'java' : 'cpp'
                  } />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit Mock Test
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
