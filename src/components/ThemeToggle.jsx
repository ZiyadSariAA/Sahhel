import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-colors ${
        isDark 
          ? 'bg-[#3A4440] text-[#9CBDB1] hover:bg-[#4A5450]' 
          : 'bg-[#F4F8F6] text-[#5A6662] hover:bg-[#E8F0EC]'
      } ${className}`}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع المظلم'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  )
}
