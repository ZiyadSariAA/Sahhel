import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import { useColors } from '../../hooks/useColors'
import { useAuth } from '../../hooks/useAuth'
import { trackLogin } from '../../utils/analytics'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AuthModal({ open, onOpenChange }) {
  const colors = useColors()
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const result = await signInWithGoogle()
    setIsLoading(false)

    if (result.success) {
      trackLogin('google')
      toast.success('تم تسجيل الدخول بنجاح! مرحباً بك 👋')
      onOpenChange(false)
    } else {
      if (result.error?.includes('popup-closed')) {
        toast.error('تم إلغاء تسجيل الدخول')
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">مرحباً بك في سهّل 👋</DialogTitle>
          <DialogDescription className="text-center">
            سجّل دخولك للوصول لجميع الميزات
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border ${colors.border} ${colors.bgSecondary} ${colors.text} hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium">
              {isLoading ? 'جاري تسجيل الدخول...' : 'الدخول بحساب Google'}
            </span>
          </button>

          {/* Info */}
          <p className={`text-xs text-center ${colors.textMuted}`}>
            بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
