import React, { useState, useEffect } from 'react';
import { courseAPI } from '../utils/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

// Tab SVG icons
const tabIcons = {
  analytics: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  courses: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  users: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  quizzes: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  certificates: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
};

const tabLabels = {
  analytics: 'Analytics',
  courses: 'Courses',
  users: 'Users',
  quizzes: 'Quiz Management',
  certificates: 'Certificates'
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [courseData, setCourseData] = useState({
    title: '', description: '', category: 'Web Development',
    difficulty: 'Beginner', duration: '', instructor: ''
  });
  const [modules, setModules] = useState([
    { title: '', description: '', duration: '', content: '', order: 1, quiz: [] }
  ]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState(null);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });

  useEffect(() => {
    fetchAnalytics();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'certificates') fetchCertificates();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAllCourses();
      setCourses(res.data.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(res.data.certificates);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      setSelectedUser(null);
      alert('User deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const fetchModuleQuizAdmin = async (courseId, moduleId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/quiz/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizData(res.data.quiz || []);
      setSelectedModuleForQuiz(res.data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    }
  };

  const handleAddQuizQuestion = async () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt)) {
      alert('Please fill all question and option fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/courses/${selectedCourseForQuiz}/modules/${selectedModuleForQuiz.moduleId}/quiz`,
        newQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchModuleQuizAdmin(selectedCourseForQuiz, selectedModuleForQuiz.moduleId);
      setNewQuestion({ question: '', options: ['', '', '', ''], correctIndex: 0 });
      alert('Quiz question added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDeleteQuizQuestion = async (questionIndex) => {
    if (!window.confirm('Delete this quiz question?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/courses/${selectedCourseForQuiz}/modules/${selectedModuleForQuiz.moduleId}/quiz/${questionIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchModuleQuizAdmin(selectedCourseForQuiz, selectedModuleForQuiz.moduleId);
      alert('Quiz question deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleCourseChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '', duration: '', content: '', order: modules.length + 1 }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await courseAPI.createCourse({ ...courseData, modules });
      setMessage('Course created successfully!');
      setCourseData({ title: '', description: '', category: 'Web Development', difficulty: 'Beginner', duration: '', instructor: '' });
      setModules([{ title: '', description: '', duration: '', content: '', order: 1, quiz: [] }]);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseAPI.deleteCourse(id);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        {Object.keys(tabIcons).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tabIcons[tab]}
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && analytics && (
        <div className="admin-form-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Analytics Dashboard
          </h2>

          <div className="stats-row" style={{ marginBottom: '1rem' }}>
            <div className="stat-card">
              <div className="stat-icon blue">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="stat-info">
                <h4>Total Users</h4>
                <div className="stat-number">{analytics.totalUsers}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="stat-info">
                <h4>Total Courses</h4>
                <div className="stat-number">{analytics.totalCourses}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="stat-info">
                <h4>Completion Rate</h4>
                <div className="stat-number">{analytics.completionRate}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div className="stat-info">
                <h4>Completed Modules</h4>
                <div className="stat-number">{analytics.totalCompletedModules || 0}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Popular Course</div>
              {analytics.popularCourse ? (
                <div style={{ color: 'var(--text-dark)' }}>
                  <div style={{ fontWeight: 600 }}>{analytics.popularCourse.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {analytics.popularCourse.category} • {analytics.popularCourse.difficulty} • {analytics.popularCourse.enrollments} enrollments
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No enrollments yet.</div>
              )}
            </div>

            <div style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Courses by Difficulty</div>
              <div style={{ maxWidth: '260px', margin: '0 auto' }}>
                <Doughnut
                  data={{
                    labels: ['Beginner', 'Intermediate', 'Advanced'],
                    datasets: [
                      {
                        data: [
                          analytics.difficultyBreakdown?.Beginner || 0,
                          analytics.difficultyBreakdown?.Intermediate || 0,
                          analytics.difficultyBreakdown?.Advanced || 0
                        ],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                      }
                    ]
                  }}
                  options={{ plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-muted)' } } } }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
      <div className="admin-grid">
        {/* Left - Add Course Form */}
        <div className="admin-form-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add New Course
          </h2>

          {message && <div className="success-msg">{message}</div>}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Course Title</label>
              <input className="form-input" type="text" name="title" value={courseData.title}
                onChange={handleCourseChange} required placeholder="e.g., Complete Web Development" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={courseData.description}
                onChange={handleCourseChange} required placeholder="Brief course description" rows="3" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-input" name="category" value={courseData.category} onChange={handleCourseChange}>
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Data Science</option>
                <option>Machine Learning</option>
                <option>Cloud Computing</option>
                <option>Cybersecurity</option>
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select className="form-input" name="difficulty" value={courseData.difficulty} onChange={handleCourseChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input className="form-input" type="text" name="duration" value={courseData.duration}
                onChange={handleCourseChange} required placeholder="e.g., 30 hours" />
            </div>
            <div className="form-group">
              <label>Instructor</label>
              <input className="form-input" type="text" name="instructor" value={courseData.instructor}
                onChange={handleCourseChange} placeholder="e.g., Dr. John Smith" />
            </div>

            {/* Modules */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '1.25rem 0 0.75rem' }}>Course Modules</h3>
            {modules.map((mod, idx) => (
              <div key={idx} className="module-form-block">
                <h4>
                  Module {idx + 1}
                  {modules.length > 1 && (
                    <button type="button" className="btn-remove-module" onClick={() => removeModule(idx)}>Remove</button>
                  )}
                </h4>
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-input" type="text" value={mod.title}
                    onChange={(e) => handleModuleChange(idx, 'title', e.target.value)} required placeholder="Module title" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input className="form-input" type="text" value={mod.description}
                    onChange={(e) => handleModuleChange(idx, 'description', e.target.value)} placeholder="Module description" />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input className="form-input" type="text" value={mod.duration}
                    onChange={(e) => handleModuleChange(idx, 'duration', e.target.value)} placeholder="e.g., 3 hours" />
                </div>
              </div>
            ))}
            <button type="button" className="btn-add-module" onClick={addModule}>+ Add Module</button>
            <button type="submit" className="auth-btn">Create Course</button>
          </form>
        </div>

        {/* Right - Manage Courses */}
        <div className="manage-courses-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Manage Courses ({courses.length})
          </h2>

          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course._id} className="course-list-item">
                <div className="course-list-info">
                  <h4>{course.title}</h4>
                  <p>{course.category} • {course.difficulty} • {course.modules?.length || 0} modules</p>
                </div>
                <div className="course-list-actions">
                  <button className="btn-sm btn-sm-danger" onClick={() => handleDelete(course._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <p>No courses yet. Create one!</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-form-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            User Management ({users.length} users)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {users.map(user => (
                <div key={user._id} onClick={() => fetchUserDetails(user._id)}
                  style={{ padding: '1rem', marginBottom: '0.75rem', background: selectedUser?.user?._id === user._id ? 'var(--primary-light)' : 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email} • {user.role}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{user.experienceLevel}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                      {user.currentStreak}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      {user.badges?.length || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {selectedUser ? (
                <div style={{ position: 'sticky', top: '1rem', padding: '1.25rem', background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{selectedUser.user.name}</h3>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedUser.user.email}</div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Experience:</strong> {selectedUser.user.experienceLevel}</div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <strong>Streak:</strong> {selectedUser.user.currentStreak} days
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                  </div>
                  <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>Progress ({selectedUser.progress.length})</h4>
                  {selectedUser.progress.map(prog => (
                    <div key={prog._id} style={{ padding: '0.75rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600 }}>{prog.courseId?.title}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Progress: {prog.progressPercentage}% • {prog.completedModules?.length || 0} modules</div>
                    </div>
                  ))}
                  {selectedUser.user.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(selectedUser.user._id)}
                      style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                      Delete User
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Select a user</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Management Tab */}
      {activeTab === 'quizzes' && (
        <div className="admin-form-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Quiz Management
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Select Course & Module</h3>
              {courses.map(course => (
                <div key={course._id} style={{ marginBottom: '1rem' }}>
                  <div onClick={() => setSelectedCourseForQuiz(course._id)}
                    style={{ padding: '0.75rem', background: selectedCourseForQuiz === course._id ? 'var(--primary-light)' : 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {course.title}
                  </div>
                  {selectedCourseForQuiz === course._id && (
                    <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                      {course.modules?.map((mod, idx) => (
                        <div key={mod._id || idx} onClick={() => fetchModuleQuizAdmin(course._id, mod._id)}
                          style={{ padding: '0.5rem 0.75rem', background: selectedModuleForQuiz?.moduleId === mod._id ? 'var(--primary)' : 'var(--card-bg)', color: selectedModuleForQuiz?.moduleId === mod._id ? '#fff' : 'var(--text)', borderRadius: 'var(--radius-xs)', marginBottom: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', border: '1px solid var(--border)' }}>
                          Module {idx + 1}: {mod.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              {selectedModuleForQuiz ? (
                <>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>{selectedModuleForQuiz.moduleTitle} ({quizData.length} questions)</h3>
                  <div style={{ padding: '1rem', background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Add New Question
                    </h4>
                    <input className="form-input" placeholder="Question" value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} style={{ marginBottom: '0.5rem' }} />
                    {newQuestion.options.map((opt, idx) => (
                      <input key={idx} className="form-input" placeholder={`Option ${idx + 1}`} value={opt}
                        onChange={(e) => { const updated = [...newQuestion.options]; updated[idx] = e.target.value; setNewQuestion({ ...newQuestion, options: updated }); }}
                        style={{ marginBottom: '0.5rem' }} />
                    ))}
                    <select className="form-input" value={newQuestion.correctIndex}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctIndex: parseInt(e.target.value) })} style={{ marginBottom: '0.75rem' }}>
                      {newQuestion.options.map((_, idx) => <option key={idx} value={idx}>Option {idx + 1} is correct</option>)}
                    </select>
                    <button onClick={handleAddQuizQuestion} className="btn-sm btn-sm-primary">Add Question</button>
                  </div>
                  <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {quizData.map((q, idx) => (
                      <div key={idx} style={{ padding: '1rem', background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 700 }}>Q{idx + 1}: {q.question}</div>
                          <button onClick={() => handleDeleteQuizQuestion(idx)} className="btn-sm btn-sm-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>Delete</button>
                        </div>
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx} style={{ padding: '0.5rem 0.75rem', background: q.correctIndex === optIdx ? 'var(--success-light)' : 'var(--card-bg)', borderRadius: 'var(--radius-xs)', marginBottom: '0.25rem', fontSize: '0.9rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {optIdx + 1}. {opt}
                            {q.correctIndex === optIdx && (
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--success)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Select a module</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="admin-form-card">
          <h2>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            Issued Certificates ({certificates.length})
          </h2>
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {certificates.length > 0 ? certificates.map(cert => (
              <div key={cert._id} style={{ padding: '1rem', marginBottom: '0.75rem', background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{cert.userId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Course: {cert.courseId?.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {cert.certificateId}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Issued: {new Date(cert.certificateIssuedAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--primary)" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </div>
                <p>No certificates issued yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
