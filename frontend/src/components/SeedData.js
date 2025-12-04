import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function SeedData() {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    try {
      // Users
      await addDoc(collection(db, 'users'), { email: 'john@test.com', role: 'Student' });
      await addDoc(collection(db, 'users'), { email: 'jane@test.com', role: 'Job Seeker' });
      await addDoc(collection(db, 'users'), { email: 'mike@test.com', role: 'Employee' });

      // ATS Scores
      await addDoc(collection(db, 'ats_scores'), { userEmail: 'john@test.com', score: 85 });
      await addDoc(collection(db, 'ats_scores'), { userEmail: 'jane@test.com', score: 92 });
      await addDoc(collection(db, 'ats_scores'), { userEmail: 'mike@test.com', score: 45 });

      // Job Applications
      await addDoc(collection(db, 'job_applications'), { userEmail: 'john@test.com', status: 'Applied' });
      await addDoc(collection(db, 'job_applications'), { userEmail: 'jane@test.com', status: 'Interview' });
      await addDoc(collection(db, 'job_applications'), { userEmail: 'mike@test.com', status: 'Hired' });

      // Skills
      await addDoc(collection(db, 'user_skills'), { userEmail: 'john@test.com', skills: ['React', 'JavaScript'] });
      await addDoc(collection(db, 'user_skills'), { userEmail: 'jane@test.com', skills: ['Python', 'Django'] });
      await addDoc(collection(db, 'user_skills'), { userEmail: 'mike@test.com', skills: ['Node.js', 'React'] });

      // Exams
      await addDoc(collection(db, 'exams'), { userEmail: 'john@test.com', status: 'Completed' });
      await addDoc(collection(db, 'exams'), { userEmail: 'jane@test.com', status: 'In Progress' });
      await addDoc(collection(db, 'exams'), { userEmail: 'mike@test.com', status: 'Enrolled' });

      // Courses
      await addDoc(collection(db, 'courses'), { userEmail: 'john@test.com', category: 'Frontend' });
      await addDoc(collection(db, 'courses'), { userEmail: 'jane@test.com', category: 'Backend' });
      await addDoc(collection(db, 'courses'), { userEmail: 'mike@test.com', category: 'Full Stack' });

      alert('Data seeded successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Seed Sample Data</h2>
      <button 
        onClick={seedData} 
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Seeding...' : 'Seed Data'}
      </button>
    </div>
  );
}