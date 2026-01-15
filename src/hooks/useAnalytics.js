import { logEvent } from 'firebase/analytics'
import { analytics } from '../config/firebase'

export function useAnalytics() {
  const trackEvent = (eventName, eventParams = {}) => {
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

  return { trackEvent }
}
