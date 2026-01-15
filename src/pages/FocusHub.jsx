import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import autoAnimate from '@formkit/auto-animate'
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Check,
  CloudRain, Flame, Trees, Waves, VolumeOff, Volume2,
  Timer, CheckSquare, Image, BarChart3,
  ChevronRight, Coffee, Brain, Sparkles
} from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useFocusHub } from '../hooks/useFocusHub'
import ThemeToggle from '../components/ThemeToggle'
import logoImage from '../assets/Images/Frame 1.png'
import fireImage from '../assets/Images/firephoto.jpg'

// Sound imports
import rainSound from '../assets/Sounds/relaxing-rain-444802.mp3'
import oceanSound from '../assets/Sounds/gentle-ocean-waves-mix-2018-19693.mp3'
import fireSound from '../assets/Sounds/fireplace-loop-original-noise-178209.mp3'
import natureSound from '../assets/Sounds/forestbirds-319791.mp3'
import timerFinishedSound from '../assets/Sounds/timer finished.mp3'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const TIMER_PRESETS = {
  pomodoro: { focus: 25, shortBreak: 5, longBreak: 15, sessions: 4, label: 'جلسة تركيز', icon: '🧠' },
  deep: { focus: 45, shortBreak: 10, longBreak: 20, sessions: 3, label: 'علاج عميق', icon: '💊' },
  distraction: { focus: 7, shortBreak: 3, longBreak: 5, sessions: 1, label: 'علاج التشتت', icon: '🌪️' },
  custom: { focus: 30, shortBreak: 5, longBreak: 15, sessions: 4, label: 'وصفة مخصصة', icon: '📋' },
}

const VIBES = [
  { 
    id: 'simple', 
    label: 'بسيط', 
    description: 'خلفية هادئة بدون صوت',
    image: null,
    video: null,
    sound: null,
    overlay: null
  },
  { 
    id: 'rain', 
    label: 'مطر', 
    description: 'صوت المطر الهادئ',
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80',
    video: null,
    sound: rainSound,
    overlay: 'bg-gradient-to-b from-black/30 to-black/60'
  },
  { 
    id: 'nature', 
    label: 'طبيعة', 
    description: 'أصوات الغابة',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
    video: null,
    sound: natureSound,
    overlay: 'bg-gradient-to-b from-black/20 to-black/50'
  },
  { 
    id: 'fire', 
    label: 'نار', 
    description: 'صوت المدفأة الدافئة',
    image: fireImage,
    video: null,
    sound: fireSound,
    overlay: 'bg-gradient-to-b from-black/30 to-black/60'
  },
  { 
    id: 'ocean', 
    label: 'بحر', 
    description: 'أمواج البحر الهادئة',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    video: null,
    sound: oceanSound,
    overlay: 'bg-gradient-to-b from-black/20 to-black/50'
  },
  { 
    id: 'night', 
    label: 'ليل', 
    description: 'سماء الليل بدون صوت',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    video: null,
    sound: null,
    overlay: 'bg-gradient-to-b from-black/40 to-black/70'
  },
]

const SIDEBAR_ITEMS = [
  { id: 'timer', icon: Timer, label: 'المؤقت' },
  { id: 'tasks', icon: CheckSquare, label: 'المهام' },
  { id: 'vibes', icon: Image, label: 'الأجواء' },
  { id: 'stats', icon: BarChart3, label: 'الإحصائيات' },
]

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const loadTasks = () => {
  try {
    const saved = localStorage.getItem('sahhel_focus_tasks')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

const saveTasks = (tasks) => {
  localStorage.setItem('sahhel_focus_tasks', JSON.stringify(tasks))
}

const loadVibe = () => {
  try {
    return localStorage.getItem('sahhel_focus_vibe') || 'simple'
  } catch { return 'simple' }
}

const saveVibe = (vibe) => {
  localStorage.setItem('sahhel_focus_vibe', vibe)
}

// Timer state persistence
const loadTimerState = () => {
  try {
    const saved = localStorage.getItem('sahhel_focus_timer')
    if (saved) {
      const state = JSON.parse(saved)
      // Check if timer was running and calculate remaining time
      if (state.isRunning && state.lastUpdate) {
        const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000)
        const remainingTime = Math.max(0, state.time - elapsed)
        return { ...state, time: remainingTime, isRunning: remainingTime > 0 }
      }
      return state
    }
    return null
  } catch { return null }
}

const saveTimerState = (state) => {
  localStorage.setItem('sahhel_focus_timer', JSON.stringify({
    ...state,
    lastUpdate: Date.now()
  }))
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function FocusHub() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const isLoggedIn = !!user
  const { focusHubData, saveData } = useFocusHub()
  
  // Theme-aware colors (نفس نظام Home)
  const colors = {
    bg: isDark ? 'bg-[#1A1A1A]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#242928]' : 'bg-[#F4F8F6]',
    bgCard: isDark ? 'bg-[#242928]' : 'bg-white',
    text: isDark ? 'text-[#F4F8F6]' : 'text-[#1F2421]',
    textSecondary: isDark ? 'text-[#B8C7C2]' : 'text-[#5A6662]',
    textMuted: isDark ? 'text-[#8F9A96]' : 'text-[#8F9A96]',
    border: isDark ? 'border-[#3A4440]' : 'border-[#DCE7E2]',
    primary: isDark ? '#9CBDB1' : '#7AA598',
    primaryBg: isDark ? 'bg-[#9CBDB1]' : 'bg-[#7AA598]',
    accent: isDark ? '#E8B8A8' : '#D4A294',
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  // Sidebar
  const [activePanel, setActivePanel] = useState(null) // null, 'timer', 'tasks', 'vibes', 'stats'
  
  // Vibe - Always load from localStorage (faster, simpler)
  const [activeVibe, setActiveVibe] = useState(() => loadVibe())
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)
  const notificationAudioRef = useRef(null)
  
  // Tasks - Load from Firestore or LocalStorage
  const [tasks, setTasks] = useState(() => {
    if (focusHubData?.tasks) {
      return focusHubData.tasks
    }
    return loadTasks()
  })
  const [newTask, setNewTask] = useState('')
  const [newTaskSessions, setNewTaskSessions] = useState(1)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [tasksTab, setTasksTab] = useState('todo') // 'todo' or 'done'
  const taskListRef = useRef(null)
  
  // Timer - Load saved state from Firestore or LocalStorage
  const savedTimerState = useRef((() => {
    if (focusHubData?.timerState) {
      return focusHubData.timerState
    }
    return loadTimerState()
  })())
  const initialSessions = focusHubData?.statistics?.totalSessions || savedTimerState.current?.sessions || 0
  const [timerPreset, setTimerPreset] = useState(savedTimerState.current?.preset || 'pomodoro')
  const [timerMode, setTimerMode] = useState(savedTimerState.current?.mode || 'focus')
  const [time, setTime] = useState(savedTimerState.current?.time || TIMER_PRESETS.pomodoro.focus * 60)
  const [isRunning, setIsRunning] = useState(savedTimerState.current?.isRunning || false)
  const [sessionsCompleted, setSessionsCompleted] = useState(initialSessions)
  
  // Update tasks and stats from Firestore (but NOT vibe - that stays local)
  useEffect(() => {
    if (focusHubData) {
      if (focusHubData.tasks) {
        setTasks(focusHubData.tasks)
      }
      if (focusHubData.statistics?.totalSessions !== undefined) {
        setSessionsCompleted(focusHubData.statistics.totalSessions)
      }
    }
  }, [focusHubData])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  
  // Custom Timer
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(30)
  
  // Refs for save debouncing
  const initialVibeLoaded = useRef(false)
  
  const currentPreset = TIMER_PRESETS[timerPreset]
  const currentVibe = VIBES.find(v => v.id === activeVibe) || VIBES[0]
  const activeTask = tasks.find(t => t.id === activeTaskId)

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────

  // Auto-animate tasks
  useEffect(() => {
    if (taskListRef.current) {
      autoAnimate(taskListRef.current)
    }
  }, [])

  // Save vibe to localStorage only (always local, fast)
  useEffect(() => {
    if (!initialVibeLoaded.current) {
      initialVibeLoaded.current = true
      return
    }
    saveVibe(activeVibe)
  }, [activeVibe])
  
  // Save tasks and stats to Firestore (if logged in) or localStorage
  useEffect(() => {
    if (isLoggedIn && user?.uid) {
      saveData({
        tasks,
        statistics: {
          totalSessions: sessionsCompleted,
          totalMinutes: sessionsCompleted * currentPreset.focus,
          lastSessionAt: sessionsCompleted > 0 ? new Date().toISOString() : null
        }
      })
    } else {
      saveTasks(tasks)
    }
  }, [tasks, sessionsCompleted, isLoggedIn, user?.uid, currentPreset, saveData])
  
  // Save timer state to localStorage only when timer stops (not every second!)
  useEffect(() => {
    if (!isRunning) {
      saveTimerState({
        preset: timerPreset,
        mode: timerMode,
        time: time,
        isRunning: false,
        sessions: sessionsCompleted
      })
    }
  }, [isRunning, timerPreset, timerMode, time, sessionsCompleted])


  // Timer logic
  useEffect(() => {
    let interval
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000)
    } else if (time === 0 && isRunning) {
      setIsRunning(false)
      
      // Play notification sound
      if (notificationAudioRef.current) {
        notificationAudioRef.current.pause()
        notificationAudioRef.current.currentTime = 0
      }
      const notificationAudio = new Audio(timerFinishedSound)
      notificationAudio.volume = 0.7
      notificationAudioRef.current = notificationAudio
      notificationAudio.play().catch(() => {})

      // Show notification
      if (timerMode === 'focus') {
        const minutes = currentPreset.focus
        setNotificationMessage(`${minutes} دقيقة تركيز ✅ خذ استراحة!`)
        setShowNotification(true)
        const newSessionsCount = sessionsCompleted + 1
        setSessionsCompleted(newSessionsCount)
        
        // Update task session if active (use functional update)
        if (activeTaskId) {
          setTasks(prevTasks => prevTasks.map(t => 
            t.id === activeTaskId ? { ...t, completedSessions: (t.completedSessions || 0) + 1 } : t
          ))
        }
        
        // Switch to break
        if (newSessionsCount % currentPreset.sessions === 0) {
          setTimerMode('longBreak')
          setTime(currentPreset.longBreak * 60)
        } else {
          setTimerMode('shortBreak')
          setTime(currentPreset.shortBreak * 60)
        }
      } else {
        setNotificationMessage('استراحة انتهت! ابدأ جلسة تركيز جديدة')
        setShowNotification(true)
        setTimerMode('focus')
        setTime(currentPreset.focus * 60)
      }
      

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isRunning, time, timerMode, currentPreset, sessionsCompleted, activeTaskId, activeVibe])

  // Audio handling - ONLY plays when timer is RUNNING
  useEffect(() => {
    // Stop audio if not running or muted
    if (!isRunning || isMuted || !currentVibe.sound) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      return
    }

    // Start audio when timer is running and vibe has sound
    if (isRunning && currentVibe.sound && !isMuted) {
      const audio = new Audio(currentVibe.sound)
      audio.loop = true
      audio.volume = volume
      audioRef.current = audio
      audio.play().catch(() => {})
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isRunning, activeVibe, currentVibe.sound, isMuted])

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Document title update - بسيط: الوقت فقط عند التشغيل
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(time)} - Focus Hub`
    } else {
      document.title = 'Focus Hub - سهّل'
    }
  }, [time, isRunning])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          setIsRunning(prev => !prev)
          break
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            setIsRunning(false)
            if (timerMode === 'focus') setTime(currentPreset.focus * 60)
            else if (timerMode === 'shortBreak') setTime(currentPreset.shortBreak * 60)
            else setTime(currentPreset.longBreak * 60)
          }
          break
        case 'Escape':
          setActivePanel(null)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [timerMode, currentPreset])

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const task = { 
      id: Date.now().toString(), 
      text: newTask.trim(), 
      sessions: newTaskSessions,
      completedSessions: 0,
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTasks([task, ...tasks])
    if (!activeTaskId) setActiveTaskId(task.id)
    setNewTask('')
    setNewTaskSessions(1)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
    if (activeTaskId === id) {
      const remaining = tasks.filter(t => t.id !== id && !t.completed)
      setActiveTaskId(remaining[0]?.id || null)
    }
  }

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(t => !t.completed))
  }

  const selectTask = (id) => {
    setActiveTaskId(id)
  }

  const changePreset = (preset) => {
    if (preset === 'custom') {
      setShowCustomInput(true)
      return
    }
    setTimerPreset(preset)
    setTime(TIMER_PRESETS[preset].focus * 60)
    setTimerMode('focus')
    setIsRunning(false)
    setShowCustomInput(false)
  }

  const applyCustomTimer = () => {
    if (customMinutes < 1) return
    TIMER_PRESETS.custom.focus = customMinutes
    setTimerPreset('custom')
    setTime(customMinutes * 60)
    setTimerMode('focus')
    setIsRunning(false)
    setShowCustomInput(false)
  }

  const changeMode = (mode) => {
    setTimerMode(mode)
    if (mode === 'focus') setTime(currentPreset.focus * 60)
    else if (mode === 'shortBreak') setTime(currentPreset.shortBreak * 60)
    else setTime(currentPreset.longBreak * 60)
    setIsRunning(false)
  }

  const toggleTimer = useCallback(() => {
    if (!activeTaskId && tasks.length > 0) {
      setActiveTaskId(tasks.find(t => !t.completed)?.id || tasks[0].id)
    }
    
    setIsRunning(!isRunning)
  }, [isRunning, activeTaskId, tasks])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    if (timerMode === 'focus') setTime(currentPreset.focus * 60)
    else if (timerMode === 'shortBreak') setTime(currentPreset.shortBreak * 60)
    else setTime(currentPreset.longBreak * 60)
  }, [timerMode, currentPreset])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
    if (newVolume > 0) setIsMuted(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const totalTime = timerMode === 'focus' 
    ? currentPreset.focus * 60 
    : timerMode === 'shortBreak' 
      ? currentPreset.shortBreak * 60 
      : currentPreset.longBreak * 60
  const progress = ((totalTime - time) / totalTime) * 100
  const circumference = 2 * Math.PI * 140

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND (Vibe) - يتغير حسب Dark Mode
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0">
        {currentVibe.id === 'simple' ? (
          // Simple vibe: خلفية متدرجة جميلة
          <div className={`w-full h-full transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]' 
              : 'bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#e3f2fd]'
          }`}>
            {/* Subtle pattern overlay */}
            <div className={`absolute inset-0 opacity-30 ${
              isDark ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]' : ''
            }`} />
          </div>
        ) : currentVibe.image ? (
          <>
            <img 
              src={currentVibe.image} 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Overlay يتغير حسب Dark Mode */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              isDark 
                ? 'bg-black/70' 
                : currentVibe.overlay
            }`} />
          </>
        ) : currentVibe.video ? (
          <>
            <video 
              src={currentVibe.video} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              isDark 
                ? 'bg-black/70' 
                : currentVibe.overlay
            }`} />
          </>
        ) : (
          <div className={`w-full h-full transition-colors duration-300 ${
            isDark ? 'bg-[#1A1A1A]' : 'bg-[#FAFBFA]'
          }`} />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SIDEBAR - يتغير حسب Dark Mode
      ═══════════════════════════════════════════════════════════════════ */}
      <aside className="fixed top-0 right-0 h-full z-30 flex">
        {/* Icons */}
        <div className={`w-14 sm:w-16 h-full backdrop-blur-xl flex flex-col items-center py-4 gap-1 transition-colors duration-300 ${
          isDark 
            ? 'bg-black/60' 
            : 'bg-white/95 shadow-lg border-l border-[#DCE7E2]'
        }`}>
          {/* Logo */}
          <Link to="/" className={`mb-4 p-2 rounded-xl transition-colors ${
            isDark 
              ? 'hover:bg-white/10' 
              : 'hover:bg-black/5'
          }`}>
            <img src={logoImage} alt="سهّل" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg" />
          </Link>
          
          {/* Nav Items */}
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={clsx(
                'p-3 rounded-xl transition-all',
                activePanel === item.id 
                  ? isDark
                    ? 'bg-white/20 text-white' 
                    : 'bg-black/10 text-[#1F2421]'
                  : isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/10'
                    : 'text-[#5A6662] hover:text-[#1F2421] hover:bg-black/5'
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          ))}
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Bottom Actions */}
          <div className={`border-t pt-4 flex flex-col gap-1 transition-colors duration-300 ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            <ThemeToggle className={
              isDark 
                ? '!bg-white/10 !text-white/80 hover:!bg-white/20' 
                : '!bg-black/5 !text-[#5A6662] hover:!bg-black/10'
            } />
          </div>
        </div>

        {/* Panel - يتغير حسب Dark Mode */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`h-full backdrop-blur-2xl overflow-hidden transition-colors duration-300 ${
                isDark 
                  ? 'bg-black/80' 
                  : 'bg-white shadow-2xl border-l border-[#DCE7E2]'
              }`}
            >
              <div className="w-[320px] h-full overflow-y-auto p-5">
                
                {/* Close Button */}
                <button
                  onClick={() => setActivePanel(null)}
                  className={`absolute top-4 left-4 p-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-[#5A6662] hover:text-[#1F2421] hover:bg-black/5'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* ─────────────────────────────────────────────────────────
                    TIMER PANEL
                ───────────────────────────────────────────────────────── */}
                {activePanel === 'timer' && (
                  <div className="pt-8">
                    <h2 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-[#1F2421]'
                    }`}>المؤقت</h2>
                    <p className={`text-sm mb-6 ${
                      isDark ? 'text-white/60' : 'text-[#5A6662]'
                    }`}>اختر نوع الجلسة</p>
                    
                    {/* Presets */}
                    <div className="space-y-3">
                      {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
                        <div key={key}>
                          <button
                            onClick={() => changePreset(key)}
                            className={clsx(
                              'w-full p-4 rounded-xl border-2 transition-all text-right',
                              timerPreset === key
                                ? isDark
                                  ? 'border-white/40 bg-white/10'
                                  : 'border-[#7AA598] bg-[#7AA598]/10'
                                : isDark
                                  ? 'border-white/10 hover:border-white/20 bg-white/5'
                                  : 'border-[#DCE7E2] hover:border-[#7AA598] bg-[#F4F8F6]'
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{preset.icon}</span>
                              <span className={isDark ? 'text-white' : 'text-[#1F2421]'}>{preset.label}</span>
                            </div>
                            {key !== 'custom' && (
                              <div className={`text-xs space-y-0.5 ${
                                isDark ? 'text-white/50' : 'text-[#5A6662]'
                              }`}>
                                <p>{preset.focus} د تركيز</p>
                                <p>{preset.shortBreak} د راحة</p>
                              </div>
                            )}
                            {key === 'custom' && (
                              <p className={`text-xs ${
                                isDark ? 'text-white/50' : 'text-[#5A6662]'
                              }`}>
                                حدد المدة بنفسك
                              </p>
                            )}
                          </button>

                          {/* Custom Timer Input */}
                          {key === 'custom' && showCustomInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`mt-3 p-4 rounded-xl border-2 ${
                                isDark 
                                  ? 'bg-white/5 border-white/20' 
                                  : 'bg-[#F4F8F6] border-[#DCE7E2]'
                              }`}
                            >
                              <p className={`text-sm mb-3 ${
                                isDark ? 'text-white/60' : 'text-[#5A6662]'
                              }`}>كم دقيقة تبي؟</p>
                              <div className="flex items-center gap-3 mb-3">
                                <input
                                  type="number"
                                  min="1"
                                  max="180"
                                  value={customMinutes}
                                  onChange={(e) => setCustomMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))}
                                  className={`flex-1 px-4 py-3 rounded-xl text-center text-lg font-semibold focus:outline-none transition-colors ${
                                    isDark
                                      ? 'bg-white/10 border border-white/20 text-white focus:border-white/40'
                                      : 'bg-white border border-[#DCE7E2] text-[#1F2421] focus:border-[#7AA598]'
                                  }`}
                                />
                                <span className={`text-sm ${
                                  isDark ? 'text-white/60' : 'text-[#5A6662]'
                                }`}>دقيقة</span>
                              </div>
                              <div className="flex gap-2 mb-3">
                                {[15, 30, 45, 60, 90].map((mins) => (
                                  <button
                                    key={mins}
                                    onClick={() => setCustomMinutes(mins)}
                                    className={clsx(
                                      'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                                      customMinutes === mins
                                        ? isDark
                                          ? 'bg-white/20 text-white'
                                          : 'bg-[#7AA598] text-white'
                                        : isDark
                                          ? 'bg-white/10 text-white/60 hover:bg-white/15'
                                          : 'bg-white text-[#5A6662] hover:bg-[#E8F0EC] border border-[#DCE7E2]'
                                    )}
                                  >
                                    {mins}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={applyCustomTimer}
                                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                                  isDark
                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                    : 'bg-[#7AA598] text-white hover:bg-[#5D8878]'
                                }`}
                              >
                                تطبيق ({customMinutes} دقيقة)
                              </button>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    TASKS PANEL
                ───────────────────────────────────────────────────────── */}
                {activePanel === 'tasks' && (
                  <div className="pt-8">
                    <h2 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-[#1F2421]'
                    }`}>المهام</h2>
                    <p className={`text-sm mb-6 ${
                      isDark ? 'text-white/60' : 'text-[#5A6662]'
                    }`}>نظم شغلك</p>
                    
                    {/* Tabs */}
                    <div className={`flex gap-4 mb-4 border-b pb-2 transition-colors duration-300 ${
                      isDark ? 'border-white/10' : 'border-[#DCE7E2]'
                    }`}>
                      <button 
                        onClick={() => setTasksTab('todo')}
                        className={clsx(
                          'text-sm font-medium transition-colors',
                          tasksTab === 'todo' 
                            ? isDark ? 'text-white' : 'text-[#1F2421]'
                            : isDark ? 'text-white/50 hover:text-white/80' : 'text-[#5A6662] hover:text-[#1F2421]'
                        )}
                      >
                        الحالية
                      </button>
                      <button 
                        onClick={() => setTasksTab('done')}
                        className={clsx(
                          'text-sm font-medium transition-colors',
                          tasksTab === 'done' 
                            ? isDark ? 'text-white' : 'text-[#1F2421]'
                            : isDark ? 'text-white/50 hover:text-white/80' : 'text-[#5A6662] hover:text-[#1F2421]'
                        )}
                      >
                        خلصت
                      </button>
                    </div>

                    {tasksTab === 'todo' && (
                      <>
                        {/* Add Task Form */}
                        <form onSubmit={addTask} className={`rounded-xl p-4 mb-4 border border-dashed transition-colors duration-300 ${
                          isDark 
                            ? 'bg-white/5 border-white/20' 
                            : 'bg-[#F4F8F6] border-[#DCE7E2]'
                        }`}>
                          <p className={`text-sm mb-3 ${
                            isDark ? 'text-white/60' : 'text-[#5A6662]'
                          }`}>وش تبي تسوي؟</p>
                          <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="اكتب المهمة..."
                            className={`w-full px-3 py-2 rounded-lg text-sm mb-3 focus:outline-none transition-colors duration-300 ${
                              isDark
                                ? 'bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-white/30'
                                : 'bg-white border border-[#DCE7E2] text-[#1F2421] placeholder-[#8F9A96] focus:border-[#7AA598]'
                            }`}
                          />
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm ${
                              isDark ? 'text-white/60' : 'text-[#5A6662]'
                            }`}>عدد الجلسات</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setNewTaskSessions(Math.max(1, newTaskSessions - 1))}
                                className={`w-8 h-8 rounded-lg transition-colors ${
                                  isDark
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'bg-white border border-[#DCE7E2] text-[#1F2421] hover:bg-[#F4F8F6]'
                                }`}
                              >
                                -
                              </button>
                              <span className={`w-10 text-center ${
                                isDark ? 'text-white' : 'text-[#1F2421]'
                              }`}>{newTaskSessions}</span>
                              <button 
                                onClick={() => setNewTaskSessions(newTaskSessions + 1)}
                                className={`w-8 h-8 rounded-lg transition-colors ${
                                  isDark
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'bg-white border border-[#DCE7E2] text-[#1F2421] hover:bg-[#F4F8F6]'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={!newTask.trim()}
                            className={`w-full py-2 rounded-lg text-sm transition-colors disabled:opacity-40 ${
                              isDark
                                ? 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                : `${colors.primaryBg} text-white hover:opacity-90`
                            }`}
                          >
                            أضف
                          </button>
                        </form>

                        {/* Tasks List - Todo */}
                        <div ref={taskListRef} className="space-y-2">
                          {tasks.filter(t => !t.completed).map((task) => (
                            <div
                              key={task.id}
                              onClick={() => selectTask(task.id)}
                              className={clsx(
                                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                                activeTaskId === task.id
                                  ? isDark
                                    ? 'bg-white/20 border border-white/30'
                                    : 'bg-[#7AA598]/10 border border-[#7AA598]'
                                  : isDark
                                    ? 'bg-white/5 hover:bg-white/10'
                                    : 'bg-[#F4F8F6] hover:bg-[#E8F0EC]'
                              )}
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleTask(task.id) }}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isDark
                                    ? 'border-white/40 hover:border-white/60'
                                    : 'border-[#DCE7E2] hover:border-[#7AA598]'
                                }`}
                              >
                                {task.completed && <Check className={`w-3 h-3 ${
                                  isDark ? 'text-white' : 'text-[#7AA598]'
                                }`} />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate ${
                                  isDark ? 'text-white' : 'text-[#1F2421]'
                                }`}>{task.text}</p>
                                <p className={`text-xs ${
                                  isDark ? 'text-white/40' : 'text-[#8F9A96]'
                                }`}>
                                  {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                              <span className={`text-xs ${
                                isDark ? 'text-white/50' : 'text-[#5A6662]'
                              }`}>
                                {task.completedSessions || 0}/{task.sessions}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteTask(task.id) }}
                                className={`p-1 transition-colors ${
                                  isDark
                                    ? 'text-white/30 hover:text-red-400'
                                    : 'text-[#8F9A96] hover:text-red-500'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {tasks.filter(t => !t.completed).length === 0 && (
                            <p className={`text-center text-sm py-8 ${
                              isDark ? 'text-white/40' : 'text-[#8F9A96]'
                            }`}>
                              ما عندك مهام
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {tasksTab === 'done' && (
                      <div className="space-y-3">
                        {/* Clear All Button */}
                        {tasks.filter(t => t.completed).length > 0 && (
                          <motion.button
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={clearCompletedTasks}
                            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-300 ${
                              isDark
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              <span>مسح كل المهام المكتملة ({tasks.filter(t => t.completed).length})</span>
                            </div>
                          </motion.button>
                        )}

                        {/* Completed Tasks List */}
                        <div className="space-y-2">
                          {tasks.filter(t => t.completed).map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-300 ${
                                isDark ? 'bg-white/5' : 'bg-[#F4F8F6]'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                isDark ? 'bg-green-500/20' : 'bg-green-100'
                              }`}>
                                <Check className={`w-3 h-3 ${
                                  isDark ? 'text-green-400' : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate line-through ${
                                  isDark ? 'text-white/60' : 'text-[#8F9A96]'
                                }`}>{task.text}</p>
                                <p className={`text-xs ${
                                  isDark ? 'text-white/30' : 'text-[#8F9A96]'
                                }`}>
                                  {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                              <span className={`text-xs ${
                                isDark ? 'text-white/40' : 'text-[#8F9A96]'
                              }`}>
                                {task.completedSessions || 0}/{task.sessions}
                              </span>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className={`p-1 transition-colors ${
                                  isDark
                                    ? 'text-white/30 hover:text-red-400'
                                    : 'text-[#8F9A96] hover:text-red-500'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {tasks.filter(t => t.completed).length === 0 && (
                            <p className={`text-center text-sm py-8 ${
                              isDark ? 'text-white/40' : 'text-[#8F9A96]'
                            }`}>
                              ما خلصت شي بعد
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    VIBES PANEL
                ───────────────────────────────────────────────────────── */}
                {activePanel === 'vibes' && (
                  <div className="pt-8">
                    <h2 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-[#1F2421]'
                    }`}>الأجواء</h2>
                    <p className={`text-sm mb-6 ${
                      isDark ? 'text-white/60' : 'text-[#5A6662]'
                    }`}>غير الخلفية والصوت</p>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="ابحث..."
                        className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none transition-colors duration-300 ${
                          isDark
                            ? 'bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-white/30'
                            : 'bg-white border border-[#DCE7E2] text-[#1F2421] placeholder-[#8F9A96] focus:border-[#7AA598]'
                        }`}
                      />
                    </div>

                    {/* Vibes Grid */}
                    <div className="space-y-3">
                      {VIBES.map((vibe) => (
                        <button
                          key={vibe.id}
                          onClick={() => setActiveVibe(vibe.id)}
                          className={clsx(
                            'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-right',
                            activeVibe === vibe.id
                              ? isDark
                                ? 'border-white/40 bg-white/10'
                                : 'border-[#7AA598] bg-[#7AA598]/10'
                              : isDark
                                ? 'border-transparent hover:border-white/20 bg-white/5'
                                : 'border-transparent hover:border-[#7AA598] bg-[#F4F8F6]'
                          )}
                        >
                          {/* Preview */}
                          <div className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 ${
                            isDark ? 'bg-black' : 'bg-[#E8F0EC]'
                          }`}>
                            {vibe.image ? (
                              <img src={vibe.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full ${
                                isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F8F6]'
                              }`} />
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${
                              isDark ? 'text-white' : 'text-[#1F2421]'
                            }`}>{vibe.label}</p>
                            <p className={`text-xs truncate ${
                              isDark ? 'text-white/50' : 'text-[#5A6662]'
                            }`}>{vibe.description}</p>
                          </div>
                          {/* Sound Indicator */}
                          {vibe.sound && (
                            <Volume2 className={`w-4 h-4 ${
                              isDark ? 'text-white/40' : 'text-[#8F9A96]'
                            }`} />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Volume Control */}
                    {currentVibe.sound && (
                      <div className={`mt-6 pt-4 border-t transition-colors duration-300 ${
                        isDark ? 'border-white/10' : 'border-[#DCE7E2]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={toggleMute}
                            className={`p-1 transition-colors ${
                              isDark 
                                ? 'text-white/40 hover:text-white/60' 
                                : 'text-[#8F9A96] hover:text-[#5A6662]'
                            }`}
                            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
                          >
                            {isMuted ? (
                              <VolumeOff className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className={`flex-1 h-1 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full ${
                              isDark
                                ? 'bg-white/20 [&::-webkit-slider-thumb]:bg-white'
                                : 'bg-[#DCE7E2] [&::-webkit-slider-thumb]:bg-[#7AA598]'
                            }`}
                          />
                          <span className={`text-xs w-10 text-center ${
                            isDark ? 'text-white/60' : 'text-[#5A6662]'
                          }`}>
                            {Math.round((isMuted ? 0 : volume) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STATS PANEL
                ───────────────────────────────────────────────────────── */}
                {activePanel === 'stats' && (
                  <div className="pt-8">
                    <h2 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-[#1F2421]'
                    }`}>إحصائياتك</h2>
                    <p className={`text-sm mb-6 ${
                      isDark ? 'text-white/60' : 'text-[#5A6662]'
                    }`}>شوف تقدمك</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`rounded-xl p-4 text-center transition-colors duration-300 ${
                        isDark ? 'bg-white/5' : 'bg-[#F4F8F6]'
                      }`}>
                        <p className={`text-3xl font-bold ${
                          isDark ? 'text-white' : 'text-[#1F2421]'
                        }`}>{sessionsCompleted}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5A6662]'
                        }`}>جلسة اليوم</p>
                      </div>
                      <div className={`rounded-xl p-4 text-center transition-colors duration-300 ${
                        isDark ? 'bg-white/5' : 'bg-[#F4F8F6]'
                      }`}>
                        <p className={`text-3xl font-bold ${
                          isDark ? 'text-white' : 'text-[#1F2421]'
                        }`}>{Math.round(sessionsCompleted * currentPreset.focus)}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5A6662]'
                        }`}>دقيقة تركيز</p>
                      </div>
                      <div className={`rounded-xl p-4 text-center transition-colors duration-300 ${
                        isDark ? 'bg-white/5' : 'bg-[#F4F8F6]'
                      }`}>
                        <p className={`text-3xl font-bold ${
                          isDark ? 'text-white' : 'text-[#1F2421]'
                        }`}>{tasks.filter(t => t.completed).length}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5A6662]'
                        }`}>مهمة خلصت</p>
                      </div>
                      <div className={`rounded-xl p-4 text-center transition-colors duration-300 ${
                        isDark ? 'bg-white/5' : 'bg-[#F4F8F6]'
                      }`}>
                        <p className={`text-3xl font-bold ${
                          isDark ? 'text-white' : 'text-[#1F2421]'
                        }`}>{tasks.length}</p>
                        <p className={`text-xs ${
                          isDark ? 'text-white/50' : 'text-[#5A6662]'
                        }`}>كل المهام</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════
          NOTIFICATION
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border-2 ${
              isDark 
                ? 'bg-black/80 border-white/20 text-white' 
                : 'bg-white/95 border-[#7AA598]/30 text-[#1F2421]'
            }`}>
              <p className="text-lg font-semibold text-center">{notificationMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT (Timer)
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pr-14 sm:pr-20 md:pr-24">
        
        {/* Mute Button - Simple toggle for vibes with sound */}
        {currentVibe.sound && (
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-xl backdrop-blur-xl transition-all ${
                currentVibe.image || currentVibe.video
                  ? 'bg-black/50 text-white hover:bg-black/70'
                  : isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-white/90 text-[#5A6662] hover:bg-white shadow-lg'
              }`}
              title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            >
              {isMuted || volume === 0 ? (
                <VolumeOff className="w-5 h-5" />
              ) : (
                <Volume2 className={clsx('w-5 h-5', isRunning && 'animate-pulse')} />
              )}
            </button>
          </div>
        )}

        {/* Progress Circle */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6 sm:mb-8">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="140"
              fill="none"
              stroke={currentVibe.image || currentVibe.video || isDark 
                ? "rgba(255,255,255,0.1)" 
                : "rgba(0,0,0,0.1)"}
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="140"
              fill="none"
              stroke={currentVibe.image || currentVibe.video || isDark 
                ? "rgba(255,255,255,0.6)" 
                : "#7AA598"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
              transition={{ duration: 0.5 }}
            />
            {/* Indicator dot */}
            <motion.circle
              cx="50%"
              cy="10"
              r="6"
              fill={currentVibe.image || currentVibe.video || isDark ? "white" : "#7AA598"}
              style={{ 
                transformOrigin: '50% 50%',
              }}
              animate={{ 
                rotate: (progress / 100) * 360 
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={time}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-6xl sm:text-7xl font-light tabular-nums ${
                currentVibe.image || currentVibe.video 
                  ? 'text-white' 
                  : isDark ? 'text-white' : 'text-[#1F2421]'
              }`}
            >
              {formatTime(time)}
            </motion.span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Timer Controls */}
          <div className="flex items-center gap-4">
            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className={`p-4 rounded-full backdrop-blur-xl transition-colors ${
                currentVibe.image || currentVibe.video
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : isDark 
                    ? 'bg-white/10 text-white/80 hover:bg-white/20' 
                    : 'bg-[#7AA598]/10 text-[#5A6662] hover:bg-[#7AA598]/20'
              }`}
              title="إعادة تعيين (R)"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            {/* Start/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTimer}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-medium shadow-2xl transition-colors ${
                currentVibe.image || currentVibe.video
                  ? 'bg-white text-gray-900 hover:bg-white/90'
                  : isDark 
                    ? 'bg-white text-gray-900 hover:bg-white/90' 
                    : 'bg-[#7AA598] text-white hover:bg-[#5D8878]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>ابدأ</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Session Info */}
          {sessionsCompleted > 0 && (
            <div className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
              currentVibe.image || currentVibe.video
                ? 'text-white/70'
                : isDark ? 'text-white/60' : 'text-[#5A6662]'
            }`}>
              <Sparkles className="w-4 h-4" />
              <span>{sessionsCompleted} جلسة خلصت</span>
            </div>
          )}

          {/* Mode Indicator */}
          <div className={`flex items-center gap-2 backdrop-blur-lg px-4 py-2 rounded-full transition-colors duration-300 ${
            currentVibe.image || currentVibe.video
              ? 'bg-black/30 text-white/70'
              : isDark ? 'bg-white/10 text-white/60' : 'bg-[#7AA598]/10 text-[#5A6662]'
          }`}>
            {timerMode === 'focus' ? (
              <>
                <Brain className="w-4 h-4" />
                <span className="text-sm">تركيز</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                <span className="text-sm">
                  {timerMode === 'shortBreak' ? 'راحة' : 'راحة طويلة'}
                </span>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
