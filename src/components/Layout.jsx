import { useState, useMemo, memo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Heart } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import { AuthModal } from './auth'
import UserMenu from './auth/UserMenu'
import { AvatarSkeleton } from './ui'
import { trackPageView } from '../utils/analytics'
import { sendThankYouEmail } from '../utils/helpers'
import { toast } from 'sonner'
import logoImage from '../assets/Images/Frame 1.png'

// Memoize nav links - لا يتغير أبداً
const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/browse', label: 'تصفح' },
  { to: '/focus-hub', label: 'مركز التركيز' },
]

// Memoized NavLink component
const NavLink = memo(({ to, label, isActive, colors }) => (
  <Link
    to={to}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? `${colors.primaryText} ${colors.bgSecondary}`
        : `${colors.textSecondary} hover:${colors.primaryText} hover:${colors.bgSecondary}`
    }`}
  >
    {label}
  </Link>
))

NavLink.displayName = 'NavLink'

function Layout({ children, showFooter = true }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { isDark } = useTheme()
  const { pathname } = useLocation()
  const { user, loading } = useAuth()

  // Memoize colors - يتغير فقط عند تغيير isDark
  const colors = useMemo(() => ({
    bg: isDark ? 'bg-[#1A1A1A]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#242928]' : 'bg-[#F4F8F6]',
    text: isDark ? 'text-[#F4F8F6]' : 'text-[#1F2421]',
    textSecondary: isDark ? 'text-[#B8C7C2]' : 'text-[#5A6662]',
    textMuted: isDark ? 'text-[#8F9A96]' : 'text-[#8F9A96]',
    border: isDark ? 'border-[#3A4440]' : 'border-[#DCE7E2]',
    primary: isDark ? '#9CBDB1' : '#7AA598',
    primaryText: isDark ? 'text-[#9CBDB1]' : 'text-[#7AA598]',
  }), [isDark])

  // Memoize active path check
  const activePath = useMemo(() => pathname, [pathname])

  // Track page views
  useEffect(() => {
    trackPageView(pathname, document.title)
  }, [pathname])

  // Handle thank you email
  const handleThankYou = async () => {
    if (!user || !user.email) {
      toast.error('يجب تسجيل الدخول أولاً')
      setAuthModalOpen(true)
      return
    }

    toast.loading('جاري الإرسال...', { id: 'thank-you' })
    
    const result = await sendThankYouEmail(
      user.email,
      user.displayName || ''
    )

    if (result.success) {
      toast.success('تم إرسال الإيميل بنجاح! 🙏', { id: 'thank-you' })
    } else {
      toast.error('حدث خطأ في الإرسال', { id: 'thank-you' })
    }
  }

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      
      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-[#1A1A1A]/95' : 'bg-white/95'} backdrop-blur-md ${colors.border} border-b transition-colors duration-200`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="سهّل" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg" />
            <span className={`text-sm sm:text-base font-semibold ${colors.text}`}>سهّل</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                label={link.label}
                isActive={activePath === link.to}
                colors={colors}
              />
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle className="mr-2" />
            
            {/* Thank You Button */}
            {user && (
              <button
                onClick={handleThankYou}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${colors.textSecondary} hover:${colors.primaryText} mr-2`}
                title="إرسال إيميل شكر"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">شكراً</span>
              </button>
            )}
            
            {/* Auth */}
            {loading ? (
              <AvatarSkeleton />
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors`}
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            {/* Thank You Button (Mobile) */}
            {user && (
              <button
                onClick={handleThankYou}
                className={`p-2 rounded-lg ${colors.textSecondary} hover:${colors.primaryText} transition-colors`}
                title="إرسال إيميل شكر"
              >
                <Heart className="w-4 h-4" />
              </button>
            )}
            {/* Mobile Auth */}
            {loading ? (
              <AvatarSkeleton />
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 ${colors.textSecondary} transition-colors`}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`sm:hidden ${colors.bg} ${colors.border} border-t px-4 py-3`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block py-2.5 text-sm font-medium ${
                  activePath === link.to ? colors.primaryText : colors.textSecondary
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      {children}

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      {showFooter && (
        <footer className={`py-6 sm:py-8 px-4 sm:px-6 ${colors.border} border-t transition-colors duration-300`}>
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="سهّل" className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 rounded" />
              <span className={`text-xs sm:text-sm ${colors.textMuted}`}>سهّل</span>
            </div>
            <p className={`text-xs ${colors.textMuted}`}>
              © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}

export default memo(Layout)
