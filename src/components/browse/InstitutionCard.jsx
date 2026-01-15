import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, ChevronLeft } from 'lucide-react'
import { useColors } from '../../hooks/useColors'
import { trackInstitutionOpened } from '../../utils/analytics'

/**
 * InstitutionCard Component
 * @param {Object} institution - Institution data object
 */
export default function InstitutionCard({ institution }) {
  const colors = useColors()

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        to={`/browse/${institution.id}`}
        onClick={() => trackInstitutionOpened(institution.id, institution.nameAr)}
        className={`block overflow-hidden rounded-2xl ${colors.border} border transition-all duration-300 ${
          colors.isDark 
            ? 'hover:border-white/20 hover:shadow-lg hover:shadow-white/5' 
            : 'hover:border-[#7AA598]/30 hover:shadow-lg hover:shadow-black/5'
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          
          {/* Icon Section */}
          <div 
            className={`p-6 sm:p-8 sm:w-48 flex items-center justify-center bg-gradient-to-br ${institution.bgGradient}`}
          >
            <span className="text-5xl sm:text-6xl">{institution.icon}</span>
          </div>
          
          {/* Content Section */}
          <div className={`flex-1 p-5 sm:p-6 ${colors.bgCard}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg sm:text-xl font-bold ${colors.text}`}>
                    {institution.nameAr}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bgSecondary} ${colors.textMuted}`}>
                    {institution.nameEn}
                  </span>
                </div>
                
                {/* Description */}
                <p className={`text-sm ${colors.textSecondary} mb-4`}>
                  {institution.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" style={{ color: institution.color }} />
                    <span className={`text-sm ${colors.text}`}>
                      {institution.stats.courses}+ مادة
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" style={{ color: institution.color }} />
                    <span className={`text-sm ${colors.text}`}>
                      {institution.stats.questions}+ سؤال
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className={`p-3 rounded-xl ${colors.bgSecondary} transition-colors`}>
                <ChevronLeft className="w-5 h-5" style={{ color: institution.color }} />
              </div>
            </div>
            
            {/* Categories Preview */}
            {institution.hasCategories && institution.categories && (
              <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                <div className="flex flex-wrap gap-2">
                  {institution.categories.slice(0, 4).map((cat) => (
                    <span 
                      key={cat.id}
                      className={`text-xs px-3 py-1.5 rounded-full ${colors.bgSecondary} ${colors.textSecondary}`}
                    >
                      {cat.icon} {cat.nameAr}
                    </span>
                  ))}
                  {institution.categories.length > 4 && (
                    <span className={`text-xs px-3 py-1.5 rounded-full ${colors.bgSecondary} ${colors.textMuted}`}>
                      +{institution.categories.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
