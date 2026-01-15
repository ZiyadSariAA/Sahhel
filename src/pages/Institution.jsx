import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { InstitutionHeader, CategoryCard, CourseCard } from '../components/browse'
import { getInstitution, getCourses } from '../data/institutions'
import { useColors } from '../hooks/useColors'
import { trackInstitutionOpened } from '../utils/analytics'

export default function Institution() {
  const { institutionId } = useParams()
  const colors = useColors()
  const institution = getInstitution(institutionId)

  // If institution not found, redirect to browse
  if (!institution) {
    return <Navigate to="/browse" replace />
  }

  // Animation variants - optimized
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  // Check if institution has categories or direct courses
  const hasCategories = institution.hasCategories && institution.categories
  const directCourses = !hasCategories ? getCourses(institutionId) : null

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'الجهات التعليمية', to: '/browse' },
    { label: institution.nameAr }
  ]

  // Track institution opened
  useEffect(() => {
    trackInstitutionOpened(institutionId, institution.nameAr)
  }, [institutionId, institution.nameAr])

  return (
    <Layout>
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <InstitutionHeader institution={institution} />

          {/* Content - Categories or Direct Courses */}
          {hasCategories ? (
            // Show Categories
            <>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-lg sm:text-xl font-bold ${colors.text} mb-4 sm:mb-6`}
              >
                اختر التخصص
              </motion.h2>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {institution.categories.map((category) => (
                  <motion.div key={category.id} variants={itemVariants}>
                    <CategoryCard 
                      category={category}
                      institutionId={institutionId}
                      institutionColor={institution.color}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            // Show Direct Courses
            <>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-lg sm:text-xl font-bold ${colors.text} mb-4 sm:mb-6`}
              >
                المواد المتاحة
              </motion.h2>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 gap-4"
              >
                {directCourses?.map((course, index) => (
                  <motion.div key={course.id} variants={itemVariants}>
                    <CourseCard 
                      course={course}
                      basePath={`/browse/${institutionId}`}
                      color={institution.color}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </Layout>
  )
}
