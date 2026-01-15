import { logEvent } from 'firebase/analytics'
import { analytics } from '../config/firebase'

// Helper function to safely log events
const safeLogEvent = (eventName, eventParams = {}) => {
  if (!analytics) {
    console.warn('Analytics not available')
    return
  }

  try {
    logEvent(analytics, eventName, eventParams)
    console.log('📊 Event tracked:', eventName, eventParams)
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Page view tracking
export const trackPageView = (pagePath, pageTitle = '') => {
  safeLogEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title
  })
}

// Course events
export const trackCourseOpened = (courseId, courseName, institutionId) => {
  safeLogEvent('course_opened', {
    course_id: courseId,
    course_name: courseName,
    institution_id: institutionId
  })
}

// Quiz events
export const trackQuizStarted = (courseId, quizId, totalQuestions) => {
  safeLogEvent('quiz_started', {
    course_id: courseId,
    quiz_id: quizId,
    total_questions: totalQuestions
  })
}

export const trackQuizCompleted = (courseId, quizId, score, totalQuestions, timeSpent) => {
  safeLogEvent('quiz_completed', {
    course_id: courseId,
    quiz_id: quizId,
    score: score,
    total_questions: totalQuestions,
    time_spent: timeSpent // in seconds
  })
}

// Summary events
export const trackSummaryDownloaded = (courseId, fileType, fileName, fileSize) => {
  safeLogEvent('summary_downloaded', {
    course_id: courseId,
    file_type: fileType, // pdf, docx, pptx, image, etc.
    file_name: fileName,
    file_size: fileSize // in MB
  })
}

// Focus Hub events
export const trackFocusSessionStarted = (vibe, duration, hasTasks) => {
  safeLogEvent('focus_session_started', {
    vibe: vibe, // rain, fire, nature, simple, etc.
    duration: duration, // in minutes
    has_tasks: hasTasks
  })
}

export const trackFocusSessionCompleted = (duration, vibe, tasksCompleted) => {
  safeLogEvent('focus_session_completed', {
    duration: duration, // actual duration in seconds
    vibe: vibe,
    tasks_completed: tasksCompleted
  })
}

// Authentication events
export const trackLogin = (method = 'google') => {
  safeLogEvent('login', {
    method: method
  })
}

export const trackLogout = () => {
  safeLogEvent('logout')
}

// Search events
export const trackSearch = (searchTerm, resultsCount) => {
  safeLogEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  })
}

// Institution events
export const trackInstitutionOpened = (institutionId, institutionName) => {
  safeLogEvent('institution_opened', {
    institution_id: institutionId,
    institution_name: institutionName
  })
}

// Category events
export const trackCategoryOpened = (categoryId, categoryName, institutionId) => {
  safeLogEvent('category_opened', {
    category_id: categoryId,
    category_name: categoryName,
    institution_id: institutionId
  })
}

// Focus Hub additional events
export const trackFocusVibeChanged = (vibe, isLoggedIn) => {
  safeLogEvent('focus_vibe_changed', {
    vibe: vibe,
    user_logged_in: isLoggedIn
  })
}

export const trackFocusPresetChanged = (preset, isLoggedIn) => {
  safeLogEvent('focus_preset_changed', {
    preset: preset,
    user_logged_in: isLoggedIn
  })
}

export const trackFocusTaskAdded = (isLoggedIn) => {
  safeLogEvent('focus_task_added', {
    user_logged_in: isLoggedIn
  })
}

export const trackFocusTaskCompleted = (isLoggedIn) => {
  safeLogEvent('focus_task_completed', {
    user_logged_in: isLoggedIn
  })
}

export const trackFocusTaskDeleted = (isLoggedIn) => {
  safeLogEvent('focus_task_deleted', {
    user_logged_in: isLoggedIn
  })
}
