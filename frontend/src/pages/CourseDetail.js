import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, progressAPI } from '../utils/api';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await courseAPI.getCourseById(id);
      setCourse(courseRes.data.course);

      const progressRes = await progressAPI.getCourseProgress(id);
      const isEnrolled = progressRes.data.enrolled || false;
      setProgress(progressRes.data.progress);
      setEnrolled(isEnrolled);
    } catch (error) {
      console.error('Error fetching course data:', error);
      setEnrolled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await courseAPI.enrollCourse(id);
      fetchCourseData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const handleModuleComplete = async (moduleId) => {
    try {
      await progressAPI.markModuleComplete(id, moduleId);
      fetchCourseData();
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  const openQuiz = async (moduleId) => {
    try {
      setQuizLoading(true);
      setQuizResult(null);
      setActiveQuizModuleId(moduleId);
      const res = await courseAPI.getModuleQuiz(id, moduleId);
      const quiz = res.data.questions || res.data.quiz || [];
      setQuizQuestions(quiz);
      setQuizAnswers(new Array(quiz.length).fill(null));
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Unable to load quiz for this module');
      setActiveQuizModuleId(null);
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    try {
      setQuizLoading(true);
      const res = await progressAPI.submitQuiz(id, activeQuizModuleId, quizAnswers);
      setQuizResult(res.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return progress?.completedModules?.some(m => m.moduleId === moduleId);
  };

  const toggleModuleContent = (moduleId) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> Loading learning path...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p>Course not found</p>
        <Link to="/courses" className="btn-sm btn-sm-primary">Back to Courses</Link>
      </div>
    );
  }

  const pct = progress?.progressPercentage || 0;

  return (
    <div className="learning-path-page">
      {/* Header Card */}
      <div className="lp-header">
        <Link to="/courses" className="lp-back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Courses
        </Link>
        <h1>{course.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          {course.description}
        </p>

        <div className="lp-meta">
          <span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {course.instructor || 'Instructor'}
          </span>
          <span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {course.duration}
          </span>
          <span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            {course.category}
          </span>
          <span className={`badge badge-${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
        </div>

        {enrolled ? (
          <div>
            <div className="progress-wrapper">
              <div className="progress-label">
                <span>Your Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
            {pct === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                You're enrolled! Start learning by completing the modules below.
              </p>
            )}
          </div>
        ) : (
          <button onClick={handleEnroll} className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Enroll in This Course
          </button>
        )}
      </div>

      {/* Modules */}
      <h2 className="section-heading">
        Course Modules ({course.modules.length})
      </h2>

      {enrolled ? (
        <div className="modules-list">
          {course.modules.map((mod, idx) => {
            const done = isModuleCompleted(mod._id);
            const isExpanded = expandedModuleId === mod._id;
            return (
              <div key={mod._id}>
                <div className={`module-card ${done ? 'completed' : ''}`}>
                  <div className="module-left">
                    <div className={`module-check ${done ? 'done' : 'pending'}`}>
                      {done ? (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : idx + 1}
                    </div>
                    <div>
                      <div className="module-title">{mod.title}</div>
                      <div className="module-subtitle">{mod.description} • {mod.duration}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-sm btn-sm-primary"
                      onClick={() => toggleModuleContent(mod._id)}
                      type="button"
                    >
                      {isExpanded ? 'Hide Content' : (done ? 'Review Content' : 'Start Learning')}
                    </button>
                    {done && (
                      <button
                        className="btn-sm btn-sm-outline"
                        onClick={() => openQuiz(mod._id)}
                        type="button"
                      >
                        Take Quiz
                      </button>
                    )}
                  </div>
                </div>

                {/* Module Content Section */}
                {isExpanded && (
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.5rem',
                      marginTop: '0.6rem',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Module Content
                      </h3>
                      <button
                        type="button"
                        className="btn-sm btn-sm-danger"
                        onClick={() => setExpandedModuleId(null)}
                      >
                        Close
                      </button>
                    </div>

                    <div style={{ 
                      color: 'var(--text-dark)', 
                      lineHeight: '1.7', 
                      fontSize: '0.95rem',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {mod.content || 'Content for this module is being prepared. Please check back later.'}
                    </div>

                    {!done && (
                      <div style={{ 
                        marginTop: '1.5rem', 
                        padding: '1rem', 
                        background: 'var(--background-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                          Once you've finished reading the content above, mark this module as complete to unlock the quiz.
                        </p>
                        <button
                          className="btn-mark-complete"
                          onClick={() => handleModuleComplete(mod._id)}
                        >
                          Mark as Complete
                        </button>
                      </div>
                    )}

                    {done && (
                      <div style={{ 
                        marginTop: '1.5rem',
                        padding: '0.75rem',
                        background: 'var(--success-light)',
                        color: 'var(--success)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Module completed! You can now take the quiz to test your knowledge.
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Section */}
                {activeQuizModuleId === mod._id && (
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1rem 1.25rem',
                      marginTop: '0.6rem',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        Mini Quiz
                      </h3>
                      <button
                        type="button"
                        className="btn-sm btn-sm-danger"
                        onClick={() => { setActiveQuizModuleId(null); setQuizResult(null); }}
                      >
                        Close
                      </button>
                    </div>

                    {quizLoading ? (
                      <div className="loading-container" style={{ padding: '1.25rem 0' }}>
                        <div className="spinner"></div> Loading...
                      </div>
                    ) : quizQuestions.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No quiz available for this module.</p>
                    ) : (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {quizQuestions.map((q, qIdx) => (
                          <div key={qIdx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--background-secondary)', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                              {qIdx + 1}. {q.question}
                            </div>
                            <div style={{ display: 'grid', gap: '0.4rem' }}>
                              {q.options.map((opt, optIdx) => (
                                <label key={optIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-dark)', cursor: 'pointer' }}>
                                  <input
                                    type="radio"
                                    name={`q-${qIdx}`}
                                    checked={quizAnswers[qIdx] === optIdx}
                                    onChange={() => {
                                      const next = [...quizAnswers];
                                      next[qIdx] = optIdx;
                                      setQuizAnswers(next);
                                    }}
                                    style={{ accentColor: 'var(--primary)' }}
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn-sm btn-sm-primary"
                          onClick={submitQuiz}
                          disabled={quizAnswers.some((a) => a === null)}
                          style={{ alignSelf: 'flex-start' }}
                        >
                          Submit Quiz
                        </button>

                        {quizResult && (
                          <div className={quizResult.passed ? 'success-msg' : 'error-msg'}>
                            Score: {quizResult.score}/{quizResult.total} — {quizResult.passed ? 'Passed' : 'Try Again'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="enroll-banner">
          <p>Enroll in this course to start tracking your progress through the modules.</p>
          <button onClick={handleEnroll} className="btn-primary">Enroll Now</button>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
