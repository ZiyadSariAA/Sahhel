import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardCheck, FileText, Clock } from 'lucide-react'
import Layout from '../components/Layout'
import { FeatureCard, StatItem } from '../components/home'
import { useColors } from '../hooks/useColors'

export default function Home() {
  const colors = useColors()

  // Features data
  const features = [
    {
      to: '/browse',
      icon: <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
      iconBg: colors.primaryBg,
      title: 'اختبارات تفاعلية',
      description: 'اختبر معلوماتك واحصل على تغذية راجعة فورية',
      delay: 0.03
    },
    {
      to: '/browse',
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
      iconBg: colors.accentBg,
      title: 'ملخصات PDF',
      description: 'ملخصات منظمة وجاهزة للتحميل والطباعة',
      delay: 0.06
    },
    {
      to: '/focus-hub',
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
      iconBg: colors.primaryBg,
      title: 'مركز التركيز',
      description: 'مؤقت وأصوات هادئة لجلسات دراسة مركّزة',
      delay: 0.09
    },
  ]

  // Stats data
  const stats = [
    { value: '+1,000', label: 'سؤال' },
    { value: '+50', label: 'مقرر' },
    { value: '24/7', label: 'متاح' },
  ]

  return (
    <Layout>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="max-w-xl sm:max-w-2xl">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${colors.text} leading-tight mb-4 sm:mb-6`}>
              كل ما تحتاجه
              <br />
              <span style={{ color: colors.primary }}>للنجاح الأكاديمي</span>
            </h1>
            
            <p className={`text-base sm:text-lg ${colors.textSecondary} leading-relaxed mb-8 sm:mb-10 max-w-md sm:max-w-lg`}>
              منصة دراسية متكاملة تجمع الاختبارات والملخصات وأدوات التركيز في مكان واحد
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link
                to="/browse"
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 ${colors.primaryBg} text-white text-sm font-medium rounded-xl ${colors.primaryHover} transition-colors`}
              >
                ابدأ المذاكرة
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/focus-hub"
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 ${colors.bgSecondary} ${colors.textSecondary} text-sm font-medium rounded-xl ${colors.border} border transition-colors`}
              >
                وضع التركيز
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-8 sm:py-12 px-4 sm:px-6 ${colors.bgSecondary} ${colors.border} border-y transition-colors duration-300`}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 sm:gap-16">
            {stats.map((stat, index) => (
              <StatItem key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-xl sm:text-2xl font-bold ${colors.text} mb-8 sm:mb-12`}
          >
            الأدوات
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className={`py-16 sm:py-24 px-4 sm:px-6 ${colors.primaryBg} transition-colors duration-300`}>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="max-w-md sm:max-w-lg">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              ابدأ رحلتك الآن
            </h2>
            <p className="text-[#E8F0EC] text-sm sm:text-base mb-6 sm:mb-8">
              مجاني بالكامل، بدون تسجيل
            </p>
            <Link
              to="/browse"
              className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white ${colors.primaryText} text-sm font-medium rounded-xl hover:bg-[#F4F8F6] transition-colors`}
            >
              تصفح المقررات
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

    </Layout>
  )
}
