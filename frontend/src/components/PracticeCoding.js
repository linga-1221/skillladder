import React, { useState } from 'react';

// Sample coding problems with test cases
const CODING_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    detailedDescription: `You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        hidden: false
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        hidden: false
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        hidden: true
      }
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test your solution
nums = [2,7,11,15]
target = 9
result = twoSum(nums, target)
print(result)`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {2,7,11,15};
        int target = 9;
        int[] result = sol.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2,7,11,15};
    int target = 9;
    vector<int> result = sol.twoSum(nums, target);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    return [];
}

// Test your solution
const nums = [2,7,11,15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`
    }
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    detailedDescription: `You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The string is reversed in-place."
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
        explanation: "The string is reversed in-place."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        hidden: false
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        hidden: false
      }
    ],
    starterCode: {
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test your solution
s = ["h","e","l","l","o"]
reverseString(s)
print(s)`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        char[] s = {'h','e','l','l','o'};
        sol.reverseString(s);
        System.out.println(java.util.Arrays.toString(s));
    }
}`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your solution here
    }
};

int main() {
    Solution sol;
    vector<char> s = {'h','e','l','l','o'};
    sol.reverseString(s);
    
    cout << "[";
    for(int i = 0; i < s.size(); i++) {
        cout << "\"" << s[i] << "\"";
        if(i < s.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`,
      javascript: `function reverseString(s) {
    // Write your solution here
}

// Test your solution
const s = ["h","e","l","l","o"];
reverseString(s);
console.log(s);`
    }
  },
  {
    id: 3,
    title: "Valid Palindrome",
    difficulty: "Easy",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    detailedDescription: `Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        hidden: false
      },
      {
        input: '"race a car"',
        expectedOutput: 'false',
        hidden: false
      }
    ],
    starterCode: {
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test your solution
s = "A man, a plan, a canal: Panama"
result = isPalindrome(s)
print(result)`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        String s = "A man, a plan, a canal: Panama";
        boolean result = sol.isPalindrome(s);
        System.out.println(result);
    }
}`,
      cpp: `#include <string>
#include <iostream>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here
        return false;
    }
};

int main() {
    Solution sol;
    string s = "A man, a plan, a canal: Panama";
    bool result = sol.isPalindrome(s);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      javascript: `function isPalindrome(s) {
    // Write your solution here
    return false;
}

// Test your solution
const s = "A man, a plan, a canal: Panama";
const result = isPalindrome(s);
console.log(result);`
    }
  }
];

export default function PracticeCoding() {
  const [selectedProblem, setSelectedProblem] = useState(CODING_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Initialize code when problem or language changes
  React.useEffect(() => {
    setCode(selectedProblem.starterCode[selectedLanguage] || '');
    setOutput('');
    setTestResults([]);
  }, [selectedProblem, selectedLanguage]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      // Simulate code execution (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock output based on language
      let mockOutput = '';
      if (selectedLanguage === 'python') {
        mockOutput = 'Code executed successfully!\nOutput: [0, 1]';
      } else if (selectedLanguage === 'java') {
        mockOutput = 'Compilation successful!\nOutput: [0, 1]';
      } else if (selectedLanguage === 'cpp') {
        mockOutput = 'Compilation and execution successful!\nOutput: [0,1]';
      } else if (selectedLanguage === 'javascript') {
        mockOutput = 'Code executed successfully!\nOutput: [0, 1]';
      }
      
      setOutput(mockOutput);
    } catch (error) {
      setOutput('Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setOutput('Running test cases...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const results = selectedProblem.testCases.map((testCase, index) => ({
        testCase: index + 1,
        passed: Math.random() > 0.3, // Random pass/fail for demo
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: index === 0 ? '[0,1]' : testCase.expectedOutput,
        hidden: testCase.hidden
      }));
      
      setTestResults(results);
      const passedCount = results.filter(r => r.passed).length;
      setOutput(`Test Results: ${passedCount}/${results.length} test cases passed`);
    } catch (error) {
      setOutput('Error running tests: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
      {/* Left Panel - Problem Description */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Practice Problems</h2>
            <select
              value={selectedProblem.id}
              onChange={(e) => {
                const problem = CODING_PROBLEMS.find(p => p.id === parseInt(e.target.value));
                setSelectedProblem(problem);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {CODING_PROBLEMS.map(problem => (
                <option key={problem.id} value={problem.id}>
                  {problem.id}. {problem.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{selectedProblem.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedProblem.difficulty)}`}>
              {selectedProblem.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            {/* Problem Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{selectedProblem.description}</p>
              {selectedProblem.detailedDescription && (
                <p className="text-gray-600 mt-3 leading-relaxed">{selectedProblem.detailedDescription}</p>
              )}
            </div>

            {/* Examples */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Examples</h4>
              {selectedProblem.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Input:</span>
                    <code className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{example.input}</code>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Output:</span>
                    <code className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="font-semibold text-gray-700">Explanation:</span>
                      <span className="ml-2 text-sm text-gray-600">{example.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Constraints</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {selectedProblem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm">{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Language Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['python', 'java', 'cpp', 'javascript'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Testing...' : 'Run Tests'}
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50"
            placeholder="Write your code here..."
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Output Panel */}
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Output</h4>
            <div className="bg-black text-green-400 p-3 rounded-lg font-mono text-sm min-h-20 max-h-32 overflow-y-auto">
              {output || 'Click "Run Code" to see output here...'}
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Test Results</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-2 rounded-lg text-xs ${
                    result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                        Test Case {result.testCase} {result.passed ? '✓' : '✗'}
                      </span>
                      {result.hidden && <span className="text-gray-500">(Hidden)</span>}
                    </div>
                    {!result.hidden && (
                      <div className="mt-1 text-gray-600">
                        <div>Input: {result.input}</div>
                        <div>Expected: {result.expected}</div>
                        <div>Got: {result.actual}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
