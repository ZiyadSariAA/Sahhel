import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useColors } from '../../hooks/useColors'

/**
 * SearchBar Component
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Current value
 * @param {function} onChange - Change handler
 * @param {string} className - Additional classes
 */
export default function SearchBar({ 
  placeholder = 'ابحث...', 
  value, 
  onChange,
  className = ''
}) {
  const colors = useColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03, duration: 0.2, ease: "easeOut" }}
      className={`relative max-w-md ${className}`}
    >
      <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.textMuted}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-3 pr-12 pl-4 ${colors.bgSecondary} ${colors.border} border rounded-xl text-sm ${colors.text} placeholder-[#8F9A96] focus:outline-none focus:ring-2 focus:ring-[#7AA598]/50 transition-all`}
      />
    </motion.div>
  )
}
