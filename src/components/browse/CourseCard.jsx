import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HelpCircle, Play } from 'lucide-react'
import { useColors } from '../../hooks/useColors'

/**
 * CourseCard Component
 * @param {Object} course - Course data { id, nameAr, icon, questions, difficulty }
 * @param {string} basePath - Base path for the link
 * @param {string} color - Theme color
 * @param {number} index - Course index (optional, for numbered list)
 * @param {boolean} showIndex - Whether to show the index number
 */
export default function CourseCard({ 
  course, 
  basePath, 
  color, 
  index, 
  showIndex = false 
}) {
  const colors = useColors()

  const difficultyColors = {
    'سهل': { bg: colors.isDark ? 'bg-green-500/20' : 'bg-green-50', text: 'text-green-600' },
    'متوسط': { bg: colors.isDark ? 'bg-yellow-500/20' : 'bg-yellow-50', text: 'text-yellow-600' },
    'صعب': { bg: colors.isDark ? 'bg-red-500/20' : 'bg-red-50', text: 'text-red-600' },
  }

  const difficulty = difficultyColors[course.difficulty] || difficultyColors['متوسط']

  return (
    <motion.div
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        to={`${basePath}/course/${course.id}`}
        className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl ${colors.bgCard} ${colors.border} border transition-all duration-300 ${
          colors.isDark 
            ? 'hover:border-white/20 hover:bg-[#2A2F2D]' 
            : 'hover:border-[#7AA598]/30 hover:shadow-md'
        }`}
      >
        {/* Number (optional) */}
        {showIndex && (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {index + 1}
          </div>
        )}
        
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${color}10` }}
        >
          {course.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${colors.text} mb-1 truncate`}>
            {course.nameAr}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
              <HelpCircle className="w-3.5 h-3.5" />
              {course.questions} سؤال
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${difficulty.bg} ${difficulty.text}`}>
              {course.difficulty}
            </span>
          </div>
        </div>
        
        {/* Action */}
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Play className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-medium hidden sm:inline" style={{ color }}>
            ابدأ
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
