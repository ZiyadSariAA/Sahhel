import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'sahhel-theme',
    }
  )
)

// Apply theme to document
const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Hook to use theme with auto-apply
export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore()
  
  // Apply theme on change
  if (typeof window !== 'undefined') {
    applyTheme(theme)
  }
  
  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' }
}

export default useTheme
