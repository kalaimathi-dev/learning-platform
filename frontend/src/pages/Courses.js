import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../utils/api';

const thumbColors = ['bg-blue', 'bg-purple', 'bg-teal', 'bg-orange', 'bg-pink'];
const tagColors = ['blue', 'purple', 'green', 'amber', 'pink'];

// SVG icons for course thumbnails
const thumbIcons = [
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
  <svg key="chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  <svg key="cpu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  <svg key="cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" /></svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
];

const categories = [
  'All', 'Web Development', 'Mobile Development',
  'Data Science', 'Machine Learning', 'Cloud Computing'
];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [selectedCategory]);

  const fetchCourses = async () => {
    try {
      const response = selectedCategory === 'All'
        ? await courseAPI.getAllCourses()
        : await courseAPI.getCoursesByCategory(selectedCategory);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> Loading courses...
      </div>
    );
  }

  return (
    <div className="courses-browse-page">
      <div className="browse-header">
        <h1>Browse Courses</h1>
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => { setLoading(true); setSelectedCategory(e.target.value); }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course, idx) => (
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
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <p>No courses found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default Courses;
