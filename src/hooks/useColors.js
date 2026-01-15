import { useTheme } from './useTheme'

/**
 * useColors Hook - Returns theme-aware colors
 * Centralizes all color definitions for consistency
 */
export function useColors() {
  const { isDark } = useTheme()

  return {
    // Backgrounds
    bg: isDark ? 'bg-[#1A1A1A]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#242928]' : 'bg-[#F4F8F6]',
    bgCard: isDark ? 'bg-[#242928]' : 'bg-white',
    bgHover: isDark ? 'hover:bg-[#2F3633]' : 'hover:bg-[#E8F0EC]',
    
    // Text
    text: isDark ? 'text-[#F4F8F6]' : 'text-[#1F2421]',
    textSecondary: isDark ? 'text-[#B8C7C2]' : 'text-[#5A6662]',
    textMuted: isDark ? 'text-[#8F9A96]' : 'text-[#8F9A96]',
    
    // Border
    border: isDark ? 'border-[#3A4440]' : 'border-[#DCE7E2]',
    
    // Primary
    primary: isDark ? '#9CBDB1' : '#7AA598',
    primaryBg: isDark ? 'bg-[#9CBDB1]' : 'bg-[#7AA598]',
    primaryHover: isDark ? 'hover:bg-[#7AA598]' : 'hover:bg-[#5D8878]',
    primaryText: isDark ? 'text-[#9CBDB1]' : 'text-[#7AA598]',
    
    // Accent
    accent: isDark ? '#E8B8A8' : '#D4A294',
    accentBg: isDark ? 'bg-[#E8B8A8]' : 'bg-[#D4A294]',
    
    // Raw values
    isDark,
  }
}

export default useColors
