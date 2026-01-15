import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Award, Clock, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'
import { Breadcrumb, StatBox, Skeleton } from '../components/ui'
import { useColors } from '../hooks/useColors'
import { useAuth } from '../hooks/useAuth'

export default function Account() {
  const colors = useColors()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Layout>
        <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Header Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-6 sm:p-8 rounded-2xl mb-8 sm:mb-10 ${colors.bgSecondary} ${colors.border} border`}
            >
              <div className="flex items-center gap-4">
                <Skeleton variant="avatar" className="w-16 h-16 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </motion.div>

            {/* Stats Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
                  className={`p-4 rounded-xl ${colors.bgCard} ${colors.border} border text-center`}
                >
                  <Skeleton className="h-5 w-5 mx-auto mb-2 rounded" />
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </motion.div>
              ))}
            </motion.div>

            {/* Content Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className={`p-6 sm:p-8 rounded-2xl ${colors.bgCard} ${colors.border} border`}
            >
              <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-full" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </motion.div>
          </div>
        </main>
      </Layout>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  const breadcrumbItems = [
    { label: 'الرئيسية', to: '/' },
    { label: 'حسابي' }
  ]

  // Mock data - سيتم استبدالها ببيانات حقيقية من Firebase
  const stats = [
    { value: 0, label: 'كويزات مكتملة', icon: Award },
    { value: 0, label: 'ساعات دراسة', icon: Clock },
    { value: 0, label: 'نقاط', icon: TrendingUp }
  ]

  return (
    <Layout>
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`p-6 sm:p-8 rounded-2xl mb-8 sm:mb-10 ${colors.bgSecondary} ${colors.border} border`}
          >
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || user.name || 'المستخدم'} 
                  className="w-16 h-16 rounded-full object-cover border-2"
                  style={{ borderColor: colors.primary }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {(user.displayName || user.name || user.email)?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${colors.text} mb-1`}>
                  {user.displayName || user.name || 'المستخدم'}
                </h1>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${colors.bgCard} ${colors.border} border text-center`}
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${colors.primaryText}`} />
                <div className={`text-2xl font-bold ${colors.text} mb-1`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${colors.textMuted}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2, ease: "easeOut" }}
            className={`p-6 sm:p-8 rounded-2xl ${colors.bgCard} ${colors.border} border text-center`}
          >
            <User className={`w-12 h-12 mx-auto mb-4 ${colors.textMuted}`} />
            <h3 className={`font-semibold ${colors.text} mb-2`}>قريباً</h3>
            <p className={`text-sm ${colors.textSecondary}`}>
              نعمل على إضافة المزيد من الميزات
            </p>
          </motion.div>
        </div>
      </main>
    </Layout>
  )
}
