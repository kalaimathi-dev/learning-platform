import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, certificateAPI } from '../utils/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await progressAPI.getUserProgress();
      setEnrolledCourses(response.data.progress);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> Loading your progress...
      </div>
    );
  }

  // Summary stats
  const total = enrolledCourses.length;
  const completed = enrolledCourses.filter(p => p.status === 'completed').length;
  const inProgress = total - completed;

  const chartData = {
    labels: enrolledCourses.map((p) => p.courseId.title),
    datasets: [
      {
        label: 'Progress %',
        data: enrolledCourses.map((p) => p.progressPercentage || 0),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      }
    ]
  };

  const downloadCertificate = async (courseId, courseTitle) => {
    try {
      const res = await certificateAPI.download(courseId);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `certificate-${courseTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert('Certificate not available yet. Complete the course first.');
    }
  };

  return (
    <div className="progress-page">
      <h1>My Progress</h1>

      {enrolledCourses.length > 0 && (
        <div className="stat-card" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Progress Chart</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, max: 100, ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } },
                  x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="progress-summary">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div className="stat-info">
            <h4>Total Enrolled</h4>
            <div className="stat-number">{total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <h4>In Progress</h4>
            <div className="stat-number">{inProgress}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <div className="stat-number">{completed}</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses List */}
      <h2 className="section-heading">Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        <div className="enrolled-courses-list">
          {enrolledCourses.map(prog => {
            const pct = prog.progressPercentage || 0;
            return (
              <Link
                to={`/courses/${prog.courseId._id}`}
                key={prog._id}
                className="enrolled-course-item"
              >
                <h3>{prog.courseId.title}</h3>
                <p className="enrolled-desc">{prog.courseId.description}</p>

                <div className="progress-wrapper">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>

                <div className={`enrolled-status ${prog.status === 'completed' ? 'complete' : 'in-prog'}`}>
                  {prog.status === 'completed' ? (
                    <>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Completed
                    </>
                  ) : (
                    <>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      In Progress
                    </>
                  )}
                </div>

                {prog.status === 'completed' && (
                  <button
                    type="button"
                    className="btn-sm btn-sm-success"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadCertificate(prog.courseId._id, prog.courseId.title);
                    }}
                    style={{ marginTop: '0.75rem' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Download Certificate
                    </span>
                  </button>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-sm btn-sm-primary">Browse Courses</Link>
        </div>
      )}
    </div>
  );
}

export default MyCourses;
