import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { SearchBar } from '../components/ui'
import { InstitutionCard } from '../components/browse'
import { INSTITUTIONS } from '../data/institutions'
import { useColors } from '../hooks/useColors'

export default function Browse() {
  const colors = useColors()

  // Animation variants - optimized for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  }

  return (
    <Layout>
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className={`text-2xl sm:text-3xl font-bold ${colors.text} mb-2 sm:mb-3`}>
              اختر جهتك التعليمية
            </h1>
            <p className={`text-sm sm:text-base ${colors.textSecondary}`}>
              ابدأ رحلتك مع المقررات والاختبارات
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar 
            placeholder="ابحث عن مادة أو جهة..." 
            className="mb-10 sm:mb-14"
          />

          {/* Institutions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:gap-6"
          >
            {INSTITUTIONS.map((institution) => (
              <motion.div key={institution.id} variants={itemVariants}>
                <InstitutionCard institution={institution} />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className={`mt-12 p-6 rounded-2xl ${colors.bgSecondary} ${colors.border} border text-center`}
          >
            <p className={`text-sm ${colors.textSecondary} mb-2`}>
              ما لقيت جهتك؟
            </p>
            <p className={`text-xs ${colors.textMuted}`}>
              تواصل معنا وراح نضيفها قريباً 🚀
            </p>
          </motion.div>
        </div>
      </main>
    </Layout>
  )
}
