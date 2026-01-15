import { useColors } from '../../hooks/useColors'

/**
 * StatItem Component - For homepage stats section
 * @param {string} value - The statistic value
 * @param {string} label - The label below
 */
export default function StatItem({ value, label }) {
  const colors = useColors()

  return (
    <div className="text-center sm:text-right">
      <div className="text-xl sm:text-2xl font-semibold" style={{ color: colors.primary }}>
        {value}
      </div>
      <div className={`text-xs sm:text-sm ${colors.textSecondary}`}>
        {label}
      </div>
    </div>
  )
}
