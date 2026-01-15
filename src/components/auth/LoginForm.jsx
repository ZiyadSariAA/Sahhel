import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useColors } from '../../hooks/useColors'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
})

export default function LoginForm({ onSuccess }) {
  const colors = useColors()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    const result = await login(data.email, data.password)
    setIsLoading(false)

    if (result.success) {
      toast.success('تم تسجيل الدخول بنجاح')
      onSuccess?.()
    } else {
      const errorMessage = result.error.includes('user-not-found')
        ? 'البريد الإلكتروني غير موجود'
        : result.error.includes('wrong-password')
        ? 'كلمة المرور غير صحيحة'
        : 'حدث خطأ أثناء تسجيل الدخول'
      toast.error(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label className={`block text-sm font-medium ${colors.text} mb-2`}>
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.textMuted}`} />
          <input
            type="email"
            {...register('email')}
            className={`w-full pr-10 pl-4 py-3 rounded-xl ${colors.bgSecondary} ${colors.border} border ${colors.text} focus:outline-none focus:ring-2 focus:ring-[#7AA598] transition-all`}
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className={`block text-sm font-medium ${colors.text} mb-2`}>
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.textMuted}`} />
          <input
            type="password"
            {...register('password')}
            className={`w-full pr-10 pl-4 py-3 rounded-xl ${colors.bgSecondary} ${colors.border} border ${colors.text} focus:outline-none focus:ring-2 focus:ring-[#7AA598] transition-all`}
            placeholder="••••••••"
            dir="ltr"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#7AA598] hover:bg-[#5D8878] text-white'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تسجيل الدخول...
          </span>
        ) : (
          'تسجيل الدخول'
        )}
      </button>
    </form>
  )
}
