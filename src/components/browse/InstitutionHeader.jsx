import { motion } from 'framer-motion'
import { BookOpen, HelpCircle } from 'lucide-react'

/**
 * InstitutionHeader Component - Hero header for institution pages
 * @param {Object} institution - Institution data
 */
export default function InstitutionHeader({ institution }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 sm:p-8 rounded-2xl mb-8 sm:mb-10 bg-gradient-to-br ${institution.bgGradient}`}
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="text-5xl sm:text-6xl">{institution.icon}</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {institution.nameAr}
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            {institution.description}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-white/90 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {institution.stats.courses}+ مادة
            </span>
            <span className="text-sm text-white/90 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              {institution.stats.questions}+ سؤال
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
