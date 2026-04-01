import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, courseAPI } from '../utils/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// SVG icons for course thumbnails
const thumbIcons = [
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
  <svg key="chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  <svg key="cpu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  <svg key="cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" /></svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
];

const thumbColors = ['bg-blue', 'bg-purple', 'bg-teal', 'bg-orange', 'bg-pink'];
const tagColors = ['blue', 'purple', 'green', 'amber', 'pink'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await progressAPI.getDashboardStats();
      setStats(statsRes.data.stats);
      const coursesRes = await courseAPI.getRecommendedCourses();
      setRecommendedCourses(coursesRes.data.courses);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || 'User'}</h1>
        <p>Here's an overview of your learning progress</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div className="stat-info">
            <h4>Enrolled</h4>
            <div className="stat-number">{stats?.totalEnrolled || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <h4>In Progress</h4>
            <div className="stat-number">{stats?.inProgress || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <div className="stat-number">{stats?.completed || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div className="stat-info">
            <h4>Avg Progress</h4>
            <div className="stat-number">{stats?.averageProgress || 0}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
          </div>
          <div className="stat-info">
            <h4>Streak</h4>
            <div className="stat-number">{stats?.streak?.current || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts + Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ alignItems: 'stretch' }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Progress Overview</h3>
            <div style={{ maxWidth: '260px', margin: '0 auto' }}>
              <Doughnut
                data={{
                  labels: ['Completed', 'In Progress'],
                  datasets: [
                    {
                      data: [stats?.completed || 0, stats?.inProgress || 0],
                      backgroundColor: ['#10b981', '#f59e0b'],
                      borderWidth: 0
                    }
                  ]
                }}
                options={{ plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-muted)' } } } }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ alignItems: 'stretch' }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Badges / Achievements</h3>
            {stats?.badges?.length ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {stats.badges.map((b) => (
                  <span key={b.key} className="course-tag blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    {b.name}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No badges yet — complete modules, quizzes, and streaks to earn them.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <h2 className="section-heading">Recommended For You</h2>
      {recommendedCourses.length > 0 ? (
        <div className="courses-grid">
          {recommendedCourses.map((course, idx) => (
            <Link to={`/courses/${course._id}`} key={course._id} style={{ textDecoration: 'none' }}>
              <div className="course-card">
                <div className={`course-card-thumb ${thumbColors[idx % thumbColors.length]}`}>
                  {thumbIcons[idx % thumbIcons.length]}
                </div>
                <div className="course-card-body">
                  <span className={`course-tag ${tagColors[idx % tagColors.length]}`}>{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-card-footer">
                    <span className="course-duration">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {course.duration}
                    </span>
                    <span className={`badge badge-${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
          </div>
          <p>No recommendations yet. Update your interests to get personalized courses!</p>
          <Link to="/courses" className="btn-sm btn-sm-primary">Browse Courses</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
