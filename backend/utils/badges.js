const BADGES = {
  FIRST_ENROLLMENT: { key: 'FIRST_ENROLLMENT', name: 'First Enrollment' },
  FIRST_MODULE: { key: 'FIRST_MODULE', name: 'First Module Completed' },
  HALF_WAY: { key: 'HALF_WAY', name: 'Halfway There (50%)' },
  COURSE_COMPLETE: { key: 'COURSE_COMPLETE', name: 'Course Completed' },
  STREAK_7: { key: 'STREAK_7', name: '7-Day Learning Streak' },
  QUIZ_MASTER: { key: 'QUIZ_MASTER', name: 'Quiz Master (100% Score)' }
};

function ensureBadge(user, badge) {
  if (!user) return false;
  user.badges = user.badges || [];

  const exists = user.badges.some((b) => b.key === badge.key);
  if (exists) return false;

  user.badges.push({
    key: badge.key,
    name: badge.name,
    earnedAt: new Date()
  });
  return true;
}

module.exports = { BADGES, ensureBadge };
