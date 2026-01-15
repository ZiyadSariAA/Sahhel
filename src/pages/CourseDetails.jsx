import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { BookOpen, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { getInstitution, getCategory, getCourse } from '../data/institutions'
import { useColors } from '../hooks/useColors'
import { trackCourseOpened } from '../utils/analytics'

export default function CourseDetails() {
  const { institutionId, categoryId, courseId } = useParams()
  const colors = useColors()
  
  const institution = getInstitution(institutionId)
  const category = categoryId ? getCategory(institutionId, categoryId) : null
  const course = getCourse(institutionId, categoryId, courseId)

  // If institution or course not found, redirect
  if (!institution || !course) {
    return <Navigate to="/browse" replace />
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'الجهات', to: '/browse' },
    { label: institution.nameAr, to: `/browse/${institutionId}` },
    ...(category ? [{ label: category.nameAr, to: `/browse/${institutionId}/${categoryId}` }] : []),
    { label: course.nameAr }
  ]

  // Track course opened
  useEffect(() => {
    trackCourseOpened(courseId, course.nameAr, institutionId)
  }, [courseId, course.nameAr, institutionId])

  return (
    <Layout>
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 sm:p-8 rounded-2xl mb-8 sm:mb-10 ${colors.bgSecondary} ${colors.border} border`}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${institution.color}20` }}
              >
                {course.icon}
              </div>
              <div className="flex-1">
                <h1 className={`text-xl sm:text-2xl font-bold ${colors.text} mb-2`}>
                  {course.nameAr}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bgCard} ${colors.textMuted} ${colors.border} border`}>
                    {institution.nameAr}
                  </span>
                  {category && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bgCard} ${colors.textMuted} ${colors.border} border`}>
                      {category.nameAr}
                    </span>
                  )}
                  {course.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      course.difficulty === 'سهل' ? 'bg-green-500/20 text-green-600' :
                      course.difficulty === 'متوسط' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {course.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content - Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className={`text-center py-16 ${colors.bgSecondary} rounded-2xl ${colors.border} border`}
          >
            <BookOpen className={`w-12 h-12 mx-auto mb-4 ${colors.textMuted}`} />
            <h3 className={`font-semibold ${colors.text} mb-2`}>قريباً</h3>
            <p className={`text-sm ${colors.textSecondary} mb-6`}>
              نعمل على إضافة الكويزات والملخصات
            </p>
            <Link
              to={categoryId 
                ? `/browse/${institutionId}/${categoryId}` 
                : `/browse/${institutionId}`
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${colors.primaryBg} ${colors.primaryText} hover:opacity-90 transition-opacity`}
            >
              <ArrowRight className="w-4 h-4" />
              العودة للقائمة
            </Link>
          </motion.div>
        </div>
      </main>
    </Layout>
  )
}
