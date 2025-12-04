import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const FirestoreDataSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedSampleData = async () => {
    setLoading(true);
    setMessage('Seeding sample data...');

    try {
      // Sample Users Data
      const sampleUsers = [
        { email: 'john.doe@example.com', role: 'Student', status: 'Active', createdAt: new Date() },
        { email: 'jane.smith@example.com', role: 'Job Seeker', status: 'Active', createdAt: new Date() },
        { email: 'mike.wilson@example.com', role: 'Employee', status: 'Active', createdAt: new Date() },
        { email: 'sarah.johnson@example.com', role: 'Student', status: 'Active', createdAt: new Date() },
        { email: 'david.brown@example.com', role: 'Job Seeker', status: 'Inactive', createdAt: new Date() }
      ];

      // Sample ATS Scores
      const sampleATSScores = [
        { userEmail: 'john.doe@example.com', score: 85, resumeName: 'John_Resume.pdf', createdAt: new Date() },
        { userEmail: 'jane.smith@example.com', score: 92, resumeName: 'Jane_Resume.pdf', createdAt: new Date() },
        { userEmail: 'mike.wilson@example.com', score: 78, resumeName: 'Mike_Resume.pdf', createdAt: new Date() },
        { userEmail: 'sarah.johnson@example.com', score: 65, resumeName: 'Sarah_Resume.pdf', createdAt: new Date() },
        { userEmail: 'david.brown@example.com', score: 45, resumeName: 'David_Resume.pdf', createdAt: new Date() }
      ];

      // Sample Job Applications
      const sampleJobApplications = [
        { userEmail: 'john.doe@example.com', jobTitle: 'Frontend Developer', company: 'TechCorp', status: 'Applied', appliedAt: new Date() },
        { userEmail: 'jane.smith@example.com', jobTitle: 'Backend Developer', company: 'StartupXYZ', status: 'Interview', appliedAt: new Date() },
        { userEmail: 'mike.wilson@example.com', jobTitle: 'Full Stack Developer', company: 'BigTech', status: 'Rejected', appliedAt: new Date() },
        { userEmail: 'sarah.johnson@example.com', jobTitle: 'UI/UX Designer', company: 'DesignStudio', status: 'Hired', appliedAt: new Date() },
        { userEmail: 'david.brown@example.com', jobTitle: 'Data Analyst', company: 'DataCorp', status: 'Applied', appliedAt: new Date() }
      ];

      // Sample User Skills
      const sampleUserSkills = [
        { userEmail: 'john.doe@example.com', skills: ['React', 'JavaScript', 'HTML', 'CSS'], level: 'Intermediate' },
        { userEmail: 'jane.smith@example.com', skills: ['Python', 'Django', 'PostgreSQL', 'AWS'], level: 'Advanced' },
        { userEmail: 'mike.wilson@example.com', skills: ['Node.js', 'Express', 'MongoDB', 'React'], level: 'Expert' },
        { userEmail: 'sarah.johnson@example.com', skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design'], level: 'Advanced' },
        { userEmail: 'david.brown@example.com', skills: ['Excel', 'SQL', 'Tableau', 'Python'], level: 'Beginner' }
      ];

      // Sample Exams Data
      const sampleExams = [
        { userEmail: 'john.doe@example.com', examName: 'JavaScript Fundamentals', status: 'Completed', score: 88, completedAt: new Date() },
        { userEmail: 'jane.smith@example.com', examName: 'Python Advanced', status: 'In Progress', score: null, enrolledAt: new Date() },
        { userEmail: 'mike.wilson@example.com', examName: 'React Certification', status: 'Completed', score: 95, completedAt: new Date() },
        { userEmail: 'sarah.johnson@example.com', examName: 'UI/UX Design', status: 'Enrolled', score: null, enrolledAt: new Date() },
        { userEmail: 'david.brown@example.com', examName: 'Data Analysis', status: 'Enrolled', score: null, enrolledAt: new Date() }
      ];

      // Sample Courses Data
      const sampleCourses = [
        { userEmail: 'john.doe@example.com', courseName: 'React Masterclass', category: 'Frontend', status: 'Active', enrolledAt: new Date() },
        { userEmail: 'jane.smith@example.com', courseName: 'Python for Data Science', category: 'Data Science', status: 'Completed', enrolledAt: new Date() },
        { userEmail: 'mike.wilson@example.com', courseName: 'Full Stack Development', category: 'Full Stack', status: 'Active', enrolledAt: new Date() },
        { userEmail: 'sarah.johnson@example.com', courseName: 'UI/UX Design Bootcamp', category: 'Design', status: 'Active', enrolledAt: new Date() },
        { userEmail: 'david.brown@example.com', courseName: 'Excel for Business', category: 'Business', status: 'Completed', enrolledAt: new Date() }
      ];

      // Add data to Firestore
      for (const user of sampleUsers) {
        await addDoc(collection(db, 'users'), user);
      }

      for (const score of sampleATSScores) {
        await addDoc(collection(db, 'ats_scores'), score);
      }

      for (const app of sampleJobApplications) {
        await addDoc(collection(db, 'job_applications'), app);
      }

      for (const skill of sampleUserSkills) {
        await addDoc(collection(db, 'user_skills'), skill);
      }

      for (const exam of sampleExams) {
        await addDoc(collection(db, 'exams'), exam);
      }

      for (const course of sampleCourses) {
        await addDoc(collection(db, 'courses'), course);
      }

      setMessage('Sample data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      setMessage('Error seeding data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Firestore Data Seeder</h3>
      <p className="text-gray-600 mb-4">
        Click the button below to populate Firestore with sample data for the dashboard.
      </p>
      <button
        onClick={seedSampleData}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Seeding Data...' : 'Seed Sample Data'}
      </button>
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FirestoreDataSeeder;