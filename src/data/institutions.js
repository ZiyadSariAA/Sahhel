// ═══════════════════════════════════════════════════════════════════════════
// INSTITUTIONS DATA - بيانات الجهات التعليمية
// ═══════════════════════════════════════════════════════════════════════════

export const INSTITUTIONS = [
  {
    id: 'tvtc',
    nameAr: 'الكليات التقنية',
    nameEn: 'TVTC',
    description: 'المؤسسة العامة للتدريب التقني والمهني',
    icon: '📚',
    color: '#7AA598',
    bgGradient: 'from-[#7AA598] to-[#5D8878]',
    stats: { courses: 50, questions: 1000 },
    hasCategories: true, // لها تقسيمات (كليات)
    categories: [
      { id: 'cs', nameAr: 'كلية الحاسب', icon: '💻', courses: 15 },
      { id: 'mgmt', nameAr: 'كلية إدارة الأعمال', icon: '📊', courses: 20 },
      { id: 'eng', nameAr: 'كلية الهندسة', icon: '⚙️', courses: 15 },
    ]
  },
  {
    id: 'aramco',
    nameAr: 'برنامج أرامكو',
    nameEn: 'Aramco CDPNE',
    description: 'برنامج الثانوية - التحضيري',
    icon: '⚙️',
    color: '#D4A294',
    bgGradient: 'from-[#D4A294] to-[#B8847A]',
    stats: { courses: 20, questions: 500 },
    hasCategories: false, // بدون تقسيمات - مواد مباشرة
    courses: [
      { id: 'math', nameAr: 'الرياضيات', icon: '🔢', questions: 150 },
      { id: 'physics', nameAr: 'الفيزياء', icon: '⚛️', questions: 120 },
      { id: 'chemistry', nameAr: 'الكيمياء', icon: '🧪', questions: 100 },
      { id: 'english', nameAr: 'اللغة الإنجليزية', icon: '📝', questions: 130 },
    ]
  },
  {
    id: 'kau',
    nameAr: 'جامعة الملك عبدالعزيز',
    nameEn: 'KAU',
    description: 'كلية الحاسبات وتقنية المعلومات',
    icon: '🎓',
    color: '#6B8DD6',
    bgGradient: 'from-[#6B8DD6] to-[#4A6BB8]',
    stats: { courses: 100, questions: 2000 },
    hasCategories: true, // لها تقسيمات (سنوات)
    categories: [
      { id: 'prep', nameAr: 'السنة التحضيرية', icon: '📖', courses: 8 },
      { id: 'y1', nameAr: 'السنة الأولى', icon: '1️⃣', courses: 25 },
      { id: 'y2', nameAr: 'السنة الثانية', icon: '2️⃣', courses: 30 },
      { id: 'y3', nameAr: 'السنة الثالثة', icon: '3️⃣', courses: 20 },
      { id: 'y4', nameAr: 'السنة الرابعة', icon: '4️⃣', courses: 17 },
    ]
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// COURSES DATA - بيانات المواد (أمثلة)
// ═══════════════════════════════════════════════════════════════════════════

export const COURSES = {
  // TVTC - كلية الحاسب
  'tvtc-cs': [
    { id: 'prog101', nameAr: 'مقدمة البرمجة', icon: '💻', questions: 80, difficulty: 'سهل' },
    { id: 'db', nameAr: 'قواعد البيانات', icon: '🗄️', questions: 100, difficulty: 'متوسط' },
    { id: 'networks', nameAr: 'شبكات الحاسب', icon: '🌐', questions: 90, difficulty: 'متوسط' },
    { id: 'os', nameAr: 'نظم التشغيل', icon: '🖥️', questions: 70, difficulty: 'صعب' },
    { id: 'web', nameAr: 'تطوير الويب', icon: '🌍', questions: 85, difficulty: 'متوسط' },
  ],
  'tvtc-mgmt': [
    { id: 'acc101', nameAr: 'مبادئ المحاسبة', icon: '📊', questions: 100, difficulty: 'سهل' },
    { id: 'mgmt101', nameAr: 'مبادئ الإدارة', icon: '👔', questions: 80, difficulty: 'سهل' },
    { id: 'mkt', nameAr: 'التسويق', icon: '📈', questions: 75, difficulty: 'متوسط' },
    { id: 'hr', nameAr: 'إدارة الموارد البشرية', icon: '👥', questions: 65, difficulty: 'متوسط' },
  ],
  'tvtc-eng': [
    { id: 'eng101', nameAr: 'مقدمة الهندسة', icon: '⚙️', questions: 70, difficulty: 'سهل' },
    { id: 'mechanics', nameAr: 'ميكانيكا', icon: '🔧', questions: 90, difficulty: 'صعب' },
    { id: 'electrical', nameAr: 'كهرباء', icon: '⚡', questions: 85, difficulty: 'متوسط' },
  ],

  // KAU - السنة التحضيرية
  'kau-prep': [
    { id: 'cs101', nameAr: 'مهارات الحاسب', icon: '💻', questions: 100, difficulty: 'سهل' },
    { id: 'eng101', nameAr: 'اللغة الإنجليزية', icon: '📝', questions: 120, difficulty: 'متوسط' },
    { id: 'math101', nameAr: 'الرياضيات', icon: '🔢', questions: 150, difficulty: 'متوسط' },
    { id: 'comm', nameAr: 'مهارات التواصل', icon: '🗣️', questions: 60, difficulty: 'سهل' },
  ],
  'kau-y1': [
    { id: 'prog1', nameAr: 'برمجة 1', icon: '💻', questions: 100, difficulty: 'متوسط' },
    { id: 'discrete', nameAr: 'رياضيات متقطعة', icon: '🧮', questions: 80, difficulty: 'صعب' },
    { id: 'physics', nameAr: 'فيزياء', icon: '⚛️', questions: 90, difficulty: 'متوسط' },
  ],
  'kau-y2': [
    { id: 'ds', nameAr: 'هياكل البيانات', icon: '📊', questions: 120, difficulty: 'صعب' },
    { id: 'oop', nameAr: 'برمجة كائنية', icon: '🎯', questions: 100, difficulty: 'متوسط' },
    { id: 'algo', nameAr: 'تحليل الخوارزميات', icon: '🔄', questions: 80, difficulty: 'صعب' },
  ],
}

// Helper functions
export const getInstitution = (id) => INSTITUTIONS.find(i => i.id === id)

export const getCategory = (institutionId, categoryId) => {
  const institution = getInstitution(institutionId)
  return institution?.categories?.find(c => c.id === categoryId)
}

export const getCourses = (institutionId, categoryId) => {
  if (categoryId) {
    return COURSES[`${institutionId}-${categoryId}`] || []
  }
  const institution = getInstitution(institutionId)
  return institution?.courses || []
}

export const getCourse = (institutionId, categoryId, courseId) => {
  const courses = getCourses(institutionId, categoryId)
  return courses.find(c => c.id === courseId) || null
}