import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useColors } from '../../hooks/useColors'

/**
 * Breadcrumb Component
 * @param {Array} items - Array of { label, to } objects. Last item is current page (no link)
 */
export default function Breadcrumb({ items }) {
  const colors = useColors()

  return (
    <motion.nav
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 mb-6 sm:mb-8 flex-wrap"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <span key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className={`text-sm ${colors.primaryText} font-medium`}>
                {item.label}
              </span>
            ) : (
              <>
                <Link 
                  to={item.to}
                  className={`text-sm ${colors.textSecondary} hover:${colors.primaryText} transition-colors`}
                >
                  {item.label}
                </Link>
                <ChevronLeft className={`w-4 h-4 ${colors.textMuted}`} />
              </>
            )}
          </span>
        )
      })}
    </motion.nav>
  )
}
