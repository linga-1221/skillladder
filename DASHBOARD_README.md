# Job Provider Dashboard - Dynamic Analytics

## Overview
This dashboard provides comprehensive visual analytics for job providers with dynamic pie charts and graphical representations of key metrics from Firestore database.

## Features

### 📊 Dynamic Visualizations
- **Users Enrolled**: Pie chart showing user distribution by role (Student, Job Seeker, Employee)
- **ATS Scores**: Distribution of resume ATS scores in ranges (Excellent, Good, Average, Poor)
- **Jobs Applied**: Status breakdown of job applications (Applied, Interview, Hired, Rejected)
- **Relevant Skills**: Bar chart of top 10 most common skills among users
- **Exams Status**: Pie chart showing exam enrollment and completion status
- **Courses Registered**: Distribution of courses by category

### 🎯 Key Metrics Cards
- Total Users Enrolled
- Total Jobs Applied
- Total Exams Enrolled
- Total Courses Registered

### 📈 Real-time Data
All data is fetched dynamically from Firestore collections:
- `users` - User enrollment data
- `ats_scores` - Resume ATS scoring results
- `job_applications` - Job application tracking
- `user_skills` - User skill profiles
- `exams` - Exam enrollment and completion
- `courses` - Course registration data

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Firebase Configuration
Ensure your Firebase configuration is properly set up in `src/firebase/config.js`

### 3. Seed Sample Data
1. Start the application: `npm start`
2. Login with any user credentials
3. Navigate to `/seed-data` route
4. Click "Seed Sample Data" to populate Firestore with test data

### 4. View Dashboard
Navigate to `/dashboard` to see the dynamic analytics dashboard

## Dashboard Components

### Main Dashboard (`JobProviderDashboard.js`)
- **Overview Tab**: Summary cards and pie charts
- **Analytics Tab**: Detailed tables and user data

### Data Visualization Libraries
- **Recharts**: Used for all charts (Pie, Bar, Line charts)
- **Responsive Design**: All charts are responsive and mobile-friendly

### Firestore Collections Structure

#### Users Collection
```javascript
{
  email: "user@example.com",
  role: "Student" | "Job Seeker" | "Employee",
  status: "Active" | "Inactive",
  createdAt: Date
}
```

#### ATS Scores Collection
```javascript
{
  userEmail: "user@example.com",
  score: 85,
  resumeName: "Resume.pdf",
  createdAt: Date
}
```

#### Job Applications Collection
```javascript
{
  userEmail: "user@example.com",
  jobTitle: "Frontend Developer",
  company: "TechCorp",
  status: "Applied" | "Interview" | "Hired" | "Rejected",
  appliedAt: Date
}
```

#### User Skills Collection
```javascript
{
  userEmail: "user@example.com",
  skills: ["React", "JavaScript", "HTML", "CSS"],
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}
```

#### Exams Collection
```javascript
{
  userEmail: "user@example.com",
  examName: "JavaScript Fundamentals",
  status: "Enrolled" | "In Progress" | "Completed",
  score: 88,
  completedAt: Date
}
```

#### Courses Collection
```javascript
{
  userEmail: "user@example.com",
  courseName: "React Masterclass",
  category: "Frontend" | "Backend" | "Full Stack" | "Design" | "Data Science",
  status: "Active" | "Completed",
  enrolledAt: Date
}
```

## Usage

### 1. Access Dashboard
- Login to the application
- Navigate to the dashboard (automatically loads for job providers)

### 2. View Analytics
- **Overview Tab**: See summary metrics and pie charts
- **Analytics Tab**: View detailed user data and top performers

### 3. Real-time Updates
- Data refreshes automatically when component mounts
- Charts update dynamically based on Firestore data

### 4. Interactive Charts
- Hover over chart segments for detailed tooltips
- Charts are responsive and adapt to screen size

## Customization

### Adding New Metrics
1. Add new Firestore collection queries in `loadFirestoreData()`
2. Create data processing function (e.g., `getNewMetricData()`)
3. Add new chart component in `renderOverview()`

### Styling
- Uses Tailwind CSS for styling
- Charts use custom color palette defined in `COLORS` array
- Responsive grid layout adapts to different screen sizes

## Troubleshooting

### No Data Showing
1. Ensure Firestore rules allow read access
2. Check browser console for errors
3. Verify Firebase configuration
4. Use the data seeder to populate test data

### Charts Not Rendering
1. Verify Recharts is installed: `npm list recharts`
2. Check for JavaScript errors in console
3. Ensure data format matches expected structure

### Performance Issues
1. Limit query results using `limit()` in Firestore queries
2. Consider pagination for large datasets
3. Implement data caching if needed

## Future Enhancements
- Add date range filters
- Implement real-time updates with Firestore listeners
- Add export functionality for charts
- Include more detailed analytics and trends
- Add user role-based access control