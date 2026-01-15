import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { BookOpen } from 'lucide-react'
import Layout from '../components/Layout'
import { Breadcrumb, StatBox } from '../components/ui'
import { CourseCard } from '../components/browse'
import { getInstitution, getCategory, getCourses } from '../data/institutions'
import { useColors } from '../hooks/useColors'
import { trackCategoryOpened } from '../utils/analytics'

export default function Courses() {
  const { institutionId, categoryId } = useParams()
  const colors = useColors()
  
  const institution = getInstitution(institutionId)
  const category = getCategory(institutionId, categoryId)
  const courses = getCourses(institutionId, categoryId)

  // If institution or category not found, redirect
  if (!institution || !category) {
    return <Navigate to="/browse" replace />
  }

  // Animation variants - optimized
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'الجهات', to: '/browse' },
    { label: institution.nameAr, to: `/browse/${institutionId}` },
    { label: category.nameAr }
  ]

  const totalQuestions = courses.reduce((sum, c) => sum + c.questions, 0)

  // Track category opened
  useEffect(() => {
    trackCategoryOpened(categoryId, category.nameAr, institutionId)
  }, [categoryId, category.nameAr, institutionId])

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
                {category.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
                    {category.nameAr}
                  </h1>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bgCard} ${colors.textMuted} ${colors.border} border`}>
                    {institution.nameAr}
                  </span>
                </div>
                <p className={`text-sm ${colors.textSecondary}`}>
                  {courses.length} مادة متاحة للدراسة
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <StatBox value={courses.length} label="مادة" />
            <StatBox value={totalQuestions} label="سؤال" />
            <StatBox value="مجاني" label="بالكامل" color={institution.color} />
          </motion.div>

          {/* Courses List */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-lg font-bold ${colors.text} mb-4 sm:mb-6`}
          >
            المواد
          </motion.h2>

          {courses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {courses.map((course, index) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard 
                    course={course}
                    basePath={`/browse/${institutionId}/${categoryId}`}
                    color={institution.color}
                    index={index}
                    showIndex={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-16 ${colors.bgSecondary} rounded-2xl ${colors.border} border`}
            >
              <BookOpen className={`w-12 h-12 mx-auto mb-4 ${colors.textMuted}`} />
              <h3 className={`font-semibold ${colors.text} mb-2`}>قريباً</h3>
              <p className={`text-sm ${colors.textSecondary}`}>
                نعمل على إضافة المواد
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </Layout>
  )
}
