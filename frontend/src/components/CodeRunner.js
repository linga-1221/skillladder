import React, { useState } from 'react';

export default function CodeRunner() {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const codeTemplates = {
    python: '# Write your Python code here\nprint("Hello, World!")',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage]);
    setOutput('');
    setError('');
  };

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run');
      return;
    }

    setRunning(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('http://localhost:8000/run_code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          code: code,
          input: input
        })
      });

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output || 'Code executed successfully (no output)');
        if (result.error && result.error.trim()) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Failed to execute code. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const clearCode = () => {
    setCode(codeTemplates[language]);
    setInput('');
    setOutput('');
    setError('');
  };

  const examples = {
    python: [
      {
        name: 'Fibonacci Sequence',
        code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

n = int(input("Enter a number: "))
for i in range(n):
    print(fibonacci(i), end=" ")`,
        input: '10'
      },
      {
        name: 'Prime Numbers',
        code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

limit = int(input("Enter limit: "))
primes = [i for i in range(2, limit + 1) if is_prime(i)]
print("Prime numbers:", primes)`,
        input: '20'
      }
    ]
  };

  const loadExample = (example) => {
    setCode(example.code);
    setInput(example.input);
    setOutput('');
    setError('');
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Code Runner
          </h1>
          <p className="text-gray-600 text-lg">
            Write, run, and test your code in multiple programming languages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Language Selection */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Language</h3>
              <div className="space-y-2">
                {Object.keys(codeTemplates).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                      language === lang
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Examples */}
            {examples[language] && (
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Examples</h3>
                <div className="space-y-2">
                  {examples[language].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(example)}
                      className="w-full text-left px-3 py-2 text-sm bg-white/50 text-gray-700 rounded-lg hover:bg-white/70 transition-colors"
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="space-y-3">
                <button
                  onClick={runCode}
                  disabled={running}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {running ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Running...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                      </svg>
                      Run Code
                    </div>
                  )}
                </button>
                <button
                  onClick={clearCode}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Code Editor */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Code Editor</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your code here..."
                spellCheck={false}
              />
            </div>

            {/* Input Section */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Input (for input() function)</h3>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-24 p-4 bg-white/50 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter input values here (one per line)..."
              />
            </div>

            {/* Output Section */}
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Output</h3>
              <div className="bg-gray-900 text-white p-4 rounded-lg min-h-32 font-mono text-sm">
                {error ? (
                  <div className="text-red-400">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Error:
                    </div>
                    <pre className="whitespace-pre-wrap">{error}</pre>
                  </div>
                ) : output ? (
                  <div className="text-green-400">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Output:
                    </div>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Ready to execute code... Click "Run Code" to see output here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips for Better Coding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-blue-700">
            <div className="flex items-start">
              <div className="bg-blue-200 rounded-full p-1 mr-3 mt-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm">Use meaningful variable names</p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-200 rounded-full p-1 mr-3 mt-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm">Add comments to explain complex logic</p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-200 rounded-full p-1 mr-3 mt-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm">Test with different input values</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}