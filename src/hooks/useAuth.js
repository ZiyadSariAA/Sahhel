import { useState, useEffect, useRef } from 'react'
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { trackLogin } from '../utils/analytics'

const googleProvider = new GoogleAuthProvider()

// Global cache for auth state - يحفظ المستخدم بعد أول check
let authInitialized = false
let cachedUser = null
let authListeners = new Set()
let unsubscribeAuth = null

// Save or update user data in Firestore
async function saveUserToFirestore(firebaseUser) {
  if (!firebaseUser) return

  try {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)
    
    const userData = {
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '', // ✅ حفظ الصورة
      updatedAt: serverTimestamp()
    }

    // إذا أول مرة - أنشئ document جديد
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        // بيانات إضافية للمستخدم الجديد
        quizResults: [],
        savedProgress: {},
        focusHub: {
          tasks: [],
          customizations: {
            selectedVibe: 'rain',
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
        },
        themePreference: 'system'
      })
      console.log('✅ User document created in Firestore')
    } else {
      // تحديث البيانات إذا تغيرت
      await setDoc(userRef, userData, { merge: true })
      console.log('✅ User data updated in Firestore')
    }
  } catch (error) {
    console.error('❌ Error saving user to Firestore:', error)
    // لا نرمي error هنا - لا نريد أن نمنع تسجيل الدخول
  }
}

// Initialize auth listener once globally
function initAuthListener() {
  if (authInitialized || typeof window === 'undefined') return
  
  authInitialized = true
  
  // Set persistence
  setPersistence(auth, browserLocalPersistence).catch(console.error)
  
  // Listen for auth changes globally (once)
  unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    // Save user to Firestore when logged in
    if (firebaseUser) {
      await saveUserToFirestore(firebaseUser)
    }

    cachedUser = firebaseUser ? {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL
    } : null
    
    // Notify all hook instances
    authListeners.forEach(listener => {
      if (listener) listener(cachedUser)
    })
  })
}

// Initialize on first import
initAuthListener()

export function useAuth() {
  // Start with cached user if available (no loading!)
  const [user, setUser] = useState(cachedUser)
  const [loading, setLoading] = useState(!authInitialized)
  const listenerRef = useRef(null)

  useEffect(() => {
    // Create listener function
    const listener = (newUser) => {
      setUser(newUser)
      setLoading(false)
    }
    
    listenerRef.current = listener
    authListeners.add(listener)
    
    // Set user immediately if cached (no loading!)
    if (cachedUser !== null) {
      setUser(cachedUser)
      setLoading(false)
    } else if (authInitialized) {
      // Auth already initialized, user is null
      setLoading(false)
    }
    
    // Cleanup
    return () => {
      if (listenerRef.current) {
        authListeners.delete(listenerRef.current)
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Save user to Firestore after successful sign in
      // Note: onAuthStateChanged will also trigger, but we ensure it here too
      await saveUserToFirestore(result.user)
      
      // Track login (AuthModal will also track, but we track here too for consistency)
      trackLogin('google')
      
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user
  }
}
