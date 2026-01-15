import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useColors } from '../../hooks/useColors'
import { useAuth } from '../../hooks/useAuth'
import { trackLogout } from '../../utils/analytics'
import { toast } from 'sonner'
import clsx from 'clsx'

export default function UserMenu() {
  const colors = useColors()
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const result = await logout()
    setIsLoggingOut(false)
    
    if (result.success) {
      trackLogout()
      toast.success('تم تسجيل الخروج بنجاح')
    } else {
      toast.error('حدث خطأ أثناء تسجيل الخروج')
    }
  }

  const userInitials = user.displayName || user.name
    ? (user.displayName || user.name).charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            "flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all",
            colors.bgSecondary,
            colors.border,
            colors.text,
            "hover:opacity-90 focus:outline-none"
          )}
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-8 h-8 rounded-full object-cover border"
              style={{ borderColor: colors.primary }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {userInitials}
            </div>
          )}
          <ChevronDown className={clsx("w-4 h-4 hidden sm:block", colors.textMuted)} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={clsx(
            "min-w-[200px] rounded-xl p-1 shadow-xl border z-[100]",
            colors.bgCard,
            colors.border,
            "animate-in fade-in-0 zoom-in-95"
          )}
          side="bottom"
          align="end"
          sideOffset={8}
        >
          <DropdownMenu.Item
            asChild
            className={clsx(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer outline-none",
              "focus:bg-opacity-50 transition-colors",
              colors.text,
              colors.isDark ? "focus:bg-[#2F3633]" : "focus:bg-[#E8F0EC]"
            )}
          >
            <Link to="/account">
              <User className="w-4 h-4" />
              <span>حسابي</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className={clsx("h-px my-1", colors.border)} />

          <DropdownMenu.Item
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={clsx(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer outline-none",
              "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              "text-red-500",
              colors.isDark ? "focus:bg-[#2F3633]" : "focus:bg-[#E8F0EC]"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
