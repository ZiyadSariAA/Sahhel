import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useColors } from '../../hooks/useColors'

/**
 * FeatureCard Component
 * @param {string} to - Link destination
 * @param {string} icon - Icon component or SVG
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} iconBg - Background color class for icon
 * @param {number} delay - Animation delay
 */
export default function FeatureCard({ 
  to, 
  icon, 
  title, 
  description, 
  iconBg,
  delay = 0 
}) {
  const colors = useColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.2, ease: "easeOut" }}
    >
      <Link 
        to={to}
        className={`block p-5 sm:p-6 ${colors.bgSecondary} rounded-2xl ${colors.bgHover} transition-colors group ${colors.border} border`}
      >
        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4 sm:mb-5`}>
          {icon}
        </div>
        <h3 className={`text-sm sm:text-base font-semibold ${colors.text} mb-1.5 sm:mb-2`}>
          {title}
        </h3>
        <p className={`text-xs sm:text-sm ${colors.textSecondary} leading-relaxed`}>
          {description}
        </p>
      </Link>
    </motion.div>
  )
}
