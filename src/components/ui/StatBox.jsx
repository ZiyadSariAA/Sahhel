import { useColors } from '../../hooks/useColors'

/**
 * StatBox Component
 * @param {string|number} value - The statistic value
 * @param {string} label - The label below the value
 * @param {string} color - Custom color for the value (optional)
 */
export default function StatBox({ value, label, color }) {
  const colors = useColors()

  return (
    <div className={`p-4 rounded-xl ${colors.bgCard} ${colors.border} border text-center`}>
      <div 
        className={`text-xl sm:text-2xl font-bold ${!color ? colors.text : ''}`}
        style={color ? { color } : undefined}
      >
        {value}
      </div>
      <div className={`text-xs ${colors.textMuted}`}>{label}</div>
    </div>
  )
}
