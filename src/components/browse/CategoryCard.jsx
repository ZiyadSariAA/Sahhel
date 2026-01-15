import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useColors } from '../../hooks/useColors'
import { trackCategoryOpened } from '../../utils/analytics'

/**
 * CategoryCard Component
 * @param {Object} category - Category data { id, nameAr, icon, courses }
 * @param {string} institutionId - Parent institution ID
 * @param {string} institutionColor - Institution theme color
 */
export default function CategoryCard({ category, institutionId, institutionColor }) {
  const colors = useColors()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/browse/${institutionId}/${category.id}`}
        onClick={() => trackCategoryOpened(category.id, category.nameAr, institutionId)}
        className={`block p-5 sm:p-6 rounded-2xl ${colors.bgCard} ${colors.border} border transition-all duration-300 ${
          colors.isDark 
            ? 'hover:border-white/20 hover:bg-[#2A2F2D]' 
            : 'hover:border-[#7AA598]/30 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${institutionColor}20` }}
            >
              {category.icon}
            </div>
            <div>
              <h3 className={`font-semibold ${colors.text} mb-0.5`}>
                {category.nameAr}
              </h3>
              <p className={`text-xs ${colors.textMuted}`}>
                {category.courses} مادة
              </p>
            </div>
          </div>
          <ChevronLeft 
            className="w-5 h-5 mt-1" 
            style={{ color: institutionColor }} 
          />
        </div>
      </Link>
    </motion.div>
  )
}
