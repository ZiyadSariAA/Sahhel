import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth'

// Save Focus Hub data to Firestore (internal - don't call directly)
async function saveFocusHubToFirestore(userId, focusHubData) {
  if (!userId) return { success: false, error: 'No user ID' }

  try {
    const userRef = doc(db, 'users', userId)
    
    const dataToSave = {
      focusHub: {
        tasks: focusHubData.tasks || [],
        customizations: {
          selectedVibe: focusHubData.customizations?.selectedVibe || 'simple',
          background: focusHubData.customizations?.background || 'default',
          timerSettings: {
            defaultDuration: focusHubData.customizations?.timerSettings?.defaultDuration || 25,
            breakDuration: focusHubData.customizations?.timerSettings?.breakDuration || 5,
            autoStart: focusHubData.customizations?.timerSettings?.autoStart || false
          }
        },
        statistics: {
          totalSessions: focusHubData.statistics?.totalSessions || 0,
          totalMinutes: focusHubData.statistics?.totalMinutes || 0,
          lastSessionAt: focusHubData.statistics?.lastSessionAt || null
        },
        updatedAt: serverTimestamp()
      }
    }
    
    await setDoc(userRef, dataToSave, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('❌ Error saving Focus Hub data:', error)
    return { success: false, error: error.message }
  }
}

// Load Focus Hub data from Firestore
export async function loadFocusHubFromFirestore(userId) {
  if (!userId) return null

  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      return userData.focusHub || null
    }
    
    return null
  } catch (error) {
    console.error('Error loading Focus Hub data:', error)
    return null
  }
}

// Hook to manage Focus Hub data (Firestore for logged in users, LocalStorage for guests)
export function useFocusHub() {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [focusHubData, setFocusHubData] = useState(null)
  const saveTimeoutRef = useRef(null)
  const pendingDataRef = useRef(null)

  // Load data on mount and when auth state changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      if (isAuthenticated && user?.uid) {
        // Load from Firestore
        const data = await loadFocusHubFromFirestore(user.uid)
        
        if (!data) {
          // If no data in Firestore, initialize with LocalStorage data
          const tasks = JSON.parse(localStorage.getItem('sahhel_focus_tasks') || '[]')
          const vibe = localStorage.getItem('sahhel_focus_vibe') || 'simple'
          
          const initialData = {
            tasks,
            customizations: {
              selectedVibe: vibe,
              background: 'default',
              timerSettings: {
                defaultDuration: 25,
                breakDuration: 5,
                autoStart: false
              }
            },
            statistics: {
              totalSessions: 0,
              totalMinutes: 0,
              lastSessionAt: null
            }
          }
          
          await saveFocusHubToFirestore(user.uid, initialData)
          setFocusHubData(initialData)
        } else {
          setFocusHubData(data)
        }
      } else {
        // Load from LocalStorage for guests
        const tasks = JSON.parse(localStorage.getItem('sahhel_focus_tasks') || '[]')
        const vibe = localStorage.getItem('sahhel_focus_vibe') || 'simple'
        
        setFocusHubData({
          tasks,
          customizations: {
            selectedVibe: vibe,
            background: 'default',
            timerSettings: {
              defaultDuration: 25,
              breakDuration: 5,
              autoStart: false
            }
          },
          statistics: {
            totalSessions: 0,
            totalMinutes: 0,
            lastSessionAt: null
          }
        })
      }
      
      setLoading(false)
    }

    loadData()
  }, [isAuthenticated, user?.uid])

  // Save data function with debouncing (2 seconds delay)
  const saveData = useCallback((data) => {
    // Update local state immediately
    setFocusHubData(data)
    pendingDataRef.current = data
    
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // Debounce Firestore saves (2 seconds)
    saveTimeoutRef.current = setTimeout(async () => {
      const dataToSave = pendingDataRef.current
      if (!dataToSave) return
      
      if (isAuthenticated && user?.uid) {
        await saveFocusHubToFirestore(user.uid, dataToSave)
      } else {
        // Save to LocalStorage
        if (dataToSave.tasks) {
          localStorage.setItem('sahhel_focus_tasks', JSON.stringify(dataToSave.tasks))
        }
        if (dataToSave.customizations?.selectedVibe) {
          localStorage.setItem('sahhel_focus_vibe', dataToSave.customizations.selectedVibe)
        }
      }
      
      pendingDataRef.current = null
    }, 2000) // Wait 2 seconds before saving to Firestore
  }, [isAuthenticated, user?.uid])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    focusHubData,
    loading,
    saveData,
    isAuthenticated
  }
}
