import React, { useState } from "react";
import QuizSection from "./QuizSection";
import ProgressBar from "./ProgressBar";
import CodeRunner from "./CodeRunner";

const LANGUAGES = [
  {
    name: "C Programming",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
    resources: [
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL" },
      { label: "ProgrammingKnowledge", url: "https://www.youtube.com/playlist?list=PLS1QulWo1RIaUGP446_pWLgTZPiFizEMq" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0" },
      { label: "Jenny’s Lectures", url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31bEiyPaaH5V8g7KxmnmUr0e" },
      { label: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjC2UujKJGU8ZyG9hS3Z1xZ" }
    ],
    quizzes: []
  },
  {
    name: "C++ Programming",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    resources: [
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agKNOsNXoMpFcJ8JGoweL_F" },
      { label: "The Cherno", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" },
      { label: "ProgrammingKnowledge", url: "https://www.youtube.com/playlist?list=PLS1QulWo1RIb9WVQGJ_vh-RQusbZgO_As" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y" },
      { label: "Geeky Shows", url: "https://www.youtube.com/playlist?list=PLbGui_ZYuhijgTACCzw6bXXgP1O0nMQyP" }
    ],
    quizzes: []
  },
  {
    name: "Java",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
    resources: [
      { label: "Telusko", url: "https://www.youtube.com/playlist?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3" },
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ahwFDuExCpPFHAK829Wto2O" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=grEKMHGYyns" },
      { label: "ProgrammingKnowledge", url: "https://www.youtube.com/playlist?list=PLS1QulWo1RIYmaxcEqw5JhK3b-6rt-JkR" },
      { label: "BroCode", url: "https://www.youtube.com/playlist?list=PLZPZq0r_RZOM0mCHmbEVjT_PUBGx3JjKr" }
    ],
    quizzes: []
  },
  {
    name: "Python",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    resources: [
      { label: "Telusko", url: "https://www.youtube.com/playlist?list=PLsyeobzWxl7rtw3YT7d0G9RQ0DtRMi4cR" },
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ah7DDtYtflgwMwpT3xmjXY9" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
      { label: "ProgrammingKnowledge", url: "https://www.youtube.com/playlist?list=PLS1QulWo1RIb8nY0O0S68f_m4R8D45bma" },
      { label: "Amigoscode", url: "https://www.youtube.com/playlist?list=PLwvrYc43l1Mxk2zCOcmGQ0bM3n1bw8Tz5" }
    ],
    quizzes: []
  },
  {
    name: "Data Analytics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Data_visualization_icon.png",
    resources: [
      { label: "Ken Jee", url: "https://www.youtube.com/playlist?list=PL2zq7klxX5ATMsmyRazei7ZXkP1GHt-vk" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8" },
      { label: "Alex The Analyst", url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8FE-JWJ6r0R8v2ZdD5A4NJd" },
      { label: "Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPB9dMaqgKV1pa4ZLlr4UHH" },
      { label: "Luke Barousse", url: "https://www.youtube.com/playlist?list=PLVfyj7U8VQfR_iILR3dgsKxnfsZ1uLQeR" }
    ],
    quizzes: []
  },
  {
    name: "Cyber Security",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cyber_Security_Icon.png",
    resources: [
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" },
      { label: "NetworkChuck", url: "https://www.youtube.com/playlist?list=PLDQaRcbiSnqF5U8ffMgZzSdbMwl80r5n_" },
      { label: "The Cyber Mentor", url: "https://www.youtube.com/playlist?list=PLBf0hzazHTGOepimcI8xVwqKk5zwt9aAy" },
      { label: "HackerSploit", url: "https://www.youtube.com/playlist?list=PLBf0hzazHTGNcJm_gGbx6KJM_cjDcvxmv" }
    ],
    quizzes: []
  },
  {
    name: "Machine Learning",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Machine_learning.png",
    resources: [
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=7eh4d6sabA0" },
      { label: "Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVNJkSgNFsU2XDY2LR2xE8mE" },
      { label: "StatQuest", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUIcdlgu78MnlATeyx4cEVeR" },
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU" },
      { label: "Codebasics", url: "https://www.youtube.com/playlist?list=PLeo1K3hjS3us_ELKYSj_Fth2tIEkdKXvV" }
    ],
    quizzes: []
  },
  {
    name: "DevOps",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg",
    resources: [
      { label: "TechWorld with Nana", url: "https://www.youtube.com/playlist?list=PLy7NrYWoggjwPggqtFsI_zMAwvG0SqYCb" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=j5Zsa_eOXeY" },
      { label: "KodeKloud", url: "https://www.youtube.com/playlist?list=PL2We04F3Y_43DRYQSKS6BZI3YTr3cOjr0" },
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=lBfuK7iP0V4" },
      { label: "edureka!", url: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOFXZSuU2Ufs5ubtLb3JxItE" }
    ],
    quizzes: []
  },
  {
    name: "Cloud Computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cloud_computing_icon.svg",
    resources: [
      { label: "AWS", url: "https://www.youtube.com/playlist?list=PLhr1KZpdzukcOr_6j_zmSrvYnLUtgqsZz" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=2LaAJq1lB1Q" },
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=2LaAJq1lB1Q" },
      { label: "GCP", url: "https://www.youtube.com/playlist?list=PLIivdWyY5sqLVoXz3Fg3SX4M4MN1uH2A2" },
      { label: "Azure Academy", url: "https://www.youtube.com/playlist?list=PLX-6jz4Hgu5wTyT9sXivwNxjqF1hZpJj_" }
    ],
    quizzes: []
  },
  {
    name: "Quantum Computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Quantum_computing.png",
    resources: [
      { label: "Qiskit", url: "https://www.youtube.com/playlist?list=PLOFEBzvs-VvqRlTfj6oOoqGQtb7GpUiH6" },
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=JhHMJCUmq28" },
      { label: "Microsoft Quantum", url: "https://www.youtube.com/playlist?list=PLlrxD0HtieHje-_287YJKhY8tDeSItwtg" },
      { label: "IBM Quantum", url: "https://www.youtube.com/playlist?list=PLOFEBzvs-VvqRNRtVGbQ6S6A8IuJcR-6B" },
      { label: "Quantum Computing India", url: "https://www.youtube.com/playlist?list=PLQHeap0RmkPjxsy8s4H5KUm_YzgGFZ5_N" }
    ],
    quizzes: []
  },
  {
    name: "Artificial Intelligence (AI)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Artificial_Intelligence_logo_notext.svg",
    resources: [
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=JMUxmLyrhSk" },
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=7E-sdXI4LB0" },
      { label: "Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPuWyNRH9x1T9JklL1Bzn_x" },
      { label: "edureka!", url: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOFXZSuU2Ufs5ubtLb3JxItE" },
      { label: "Tech With Tim", url: "https://www.youtube.com/playlist?list=PLzMcBGfZo4-nyLTlSRBvo0zjSnCnqjHYQ" }
    ],
    quizzes: []
  },
  {
    name: "Internet of Things (IoT)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Internet_of_Things.png",
    resources: [
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=6wD4V0rvlDI" },
      { label: "Simplilearn", url: "https://www.youtube.com/watch?v=G5t9Ssc1DTM" },
      { label: "edureka!", url: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOFRriYt3rJde7p4cpe_MSh7" },
      { label: "TechGig", url: "https://www.youtube.com/playlist?list=PLK7VIJFUioUeJ6zjMCjRmh4JQtuI9q9Pa" },
      { label: "ProgrammingKnowledge", url: "https://www.youtube.com/playlist?list=PLS1QulWo1RIYjKzv04pIhDU5Qqr3-v3td" }
    ],
    quizzes: []
  },
  {
    name: "Web Development",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    resources: [
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=nu_pCVPKzTk" },
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ag1UuG1oJ9ZJts7vpHQ5uN" },
      { label: "Traversy Media", url: "https://www.youtube.com/playlist?list=PLillGF-RfqbZ2ybcoD2OaabW2P7Ws8CWu" },
      { label: "Programming with Mosh", url: "https://www.youtube.com/playlist?list=PLTjRvDozrdlyjm_n3a8EwzlhY8fZ1pPZM" },
      { label: "The Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp" }
    ],
    quizzes: []
  },
  {
    name: "Full Stack Development",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    resources: [
      { label: "freeCodeCamp.org", url: "https://www.youtube.com/watch?v=nu_pCVPKzTk" },
      { label: "CodeWithHarry", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiWVaPu8QX8oCG1nGfKxGZA" },
      { label: "The Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR" },
      { label: "Traversy Media", url: "https://www.youtube.com/playlist?list=PLillGF-RfqbbnEGy3ROiLWk7JMCuSyQtX" },
      { label: "edureka!", url: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOEo6HXrW5bH1l7JxYp3E-7c" }
    ],
    quizzes: []
  }
];

export default function LearnPlatform() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 mb-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Learn Programming & Tech Stacks</h2>
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {LANGUAGES.map((lang, idx) => (
          <button
            key={lang.name}
            onClick={() => setSelected(idx)}
            className={`px-4 py-2 rounded-lg shadow text-base font-semibold flex items-center gap-2 border-2 transition-all ${selected === idx ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
          >
            <img src={lang.logo} alt={lang.name} className="w-6 h-6" />
            {lang.name}
          </button>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-fadeIn">
        <img src={LANGUAGES[selected].logo} alt={LANGUAGES[selected].name} className="w-16 h-16 mx-auto mb-2" />
        <h3 className="text-2xl font-bold mb-2 text-blue-800">{LANGUAGES[selected].name}</h3>
        <p className="mb-3 text-gray-700">{LANGUAGES[selected].description}</p>
        <div className="flex flex-col gap-2 items-center">
          {LANGUAGES[selected].resources.map((res, i) => (
            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">{res.label}</a>
          ))}
        </div>
        {/* Video Tutorials */}
        {LANGUAGES[selected].videos && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2 text-blue-700">Video Tutorials</h4>
            {LANGUAGES[selected].videos.map((vid, i) => (
              <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline block mb-1">{vid.label}</a>
            ))}
          </div>
        )}
        {/* Quiz Section */}
        {LANGUAGES[selected].quizzes && (
          <QuizSection quiz={LANGUAGES[selected].quizzes} />
        )}
        {/* Code Compiler Integration */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2 text-blue-700">Try {LANGUAGES[selected].name} Code</h4>
          <CodeRunner lang={LANGUAGES[selected].name.toLowerCase().includes('python') ? 'python' : LANGUAGES[selected].name.toLowerCase().includes('java') ? 'java' : LANGUAGES[selected].name.toLowerCase().includes('c++') ? 'cpp' : LANGUAGES[selected].name.toLowerCase().includes('go') ? 'go' : LANGUAGES[selected].name.toLowerCase().includes('node') ? 'javascript' : 'python'} />
        </div>
        {/* Progress Tracking */}
        <ProgressBar language={LANGUAGES[selected].name} />
      </div>
    </div>
  );
}
