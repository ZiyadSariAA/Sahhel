# 📚 Courses Structure - البنية المرنة للمواد

## 🎯 المفهوم الأساسي

البنية الحالية **تدعم المرونة 100%** - الأدمن يختار إذا الجهة لها تقسيمات أو لا.

---

## ✅ البنية الحالية (موجودة!)

### **في `institutions.js`:**

```javascript
{
  id: 'kau',
  hasCategories: true,  // ✅ لها تقسيمات (سنوات)
  categories: [...]
}

{
  id: 'aramco',
  hasCategories: false, // ✅ مباشرة للمواد
  courses: [...]
}
```

### **Routes الحالية:**

```
/browse                                    → الجهات
/browse/:institutionId                     → التقسيمات أو المواد (حسب hasCategories)
/browse/:institutionId/:categoryId         → المواد
```

---

## 🔄 السيناريوهات المدعومة

### **السيناريو 1: مع تقسيم (كليات/سنوات/مسارات)**

```
جامعة الملك عبدالعزيز
    ↓
كليات:
├─ كلية الحاسب
│   └─ المواد: [برمجة 101, قواعد بيانات, ...]
├─ كلية الإدارة
│   └─ المواد: [مبادئ الإدارة, محاسبة, ...]
```

**البيانات:**
```javascript
{
  id: 'kau',
  hasCategories: true,
  categories: [
    { id: 'cs', nameAr: 'كلية الحاسب', courses: 15 },
    { id: 'mgmt', nameAr: 'كلية الإدارة', courses: 20 }
  ]
}
```

**الـ Routes:**
```
/browse/kau                    → عرض الكليات
/browse/kau/cs                 → عرض مواد كلية الحاسب
```

---

### **السيناريو 2: بدون تقسيم (مواد مباشرة)**

```
برنامج أرامكو
    ↓
مباشرة → المواد:
├─ الرياضيات
├─ الفيزياء
├─ الكيمياء
└─ اللغة الإنجليزية
```

**البيانات:**
```javascript
{
  id: 'aramco',
  hasCategories: false,
  courses: [
    { id: 'math', nameAr: 'الرياضيات', ... },
    { id: 'physics', nameAr: 'الفيزياء', ... }
  ]
}
```

**الـ Routes:**
```
/browse/aramco                 → عرض المواد مباشرة (في Institution.jsx)
```

---

### **السيناريو 3: اختبارات منفصلة (برنامج خاص)**

```
برنامج تطوير الخريجين
    ↓
مباشرة → الاختبارات (كل واحد مادة منفصلة):
├─ اختبار الرياضيات
├─ اختبار الإنجليزي
├─ اختبار القدرات
└─ اختبار الفيزياء
```

**البيانات:**
```javascript
{
  id: 'grad-dev',
  hasCategories: false,
  courses: [
    { id: 'math-test', nameAr: 'اختبار الرياضيات', ... },
    { id: 'eng-test', nameAr: 'اختبار الإنجليزي', ... }
  ]
}
```

**الـ Routes:**
```
/browse/grad-dev               → عرض الاختبارات مباشرة
```

---

## 📋 داخل كل مادة (Course Details)

### **عند الضغط على مادة، يجب أن تظهر:**

```
📖 علم النفس 101

┌─────────────────────────────────────┐
│ الكويزات (Quizzes)                  │
├─────────────────────────────────────┤
│ • اختبار الميد الأول (15 سؤال)      │
│ • اختبار الميد الثاني (20 سؤال)     │
│ • الاختبار النهائي (50 سؤال)        │
│ • كويز سريع (10 أسئلة)              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ الملخصات (Summaries)                │
├─────────────────────────────────────┤
│ • ملخص الفصل الأول.pdf              │
│ • ملاحظات الوورد.docx               │
│ • عرض الباوربوينت.pptx              │
│ • الملخص الشامل.pdf                  │
└─────────────────────────────────────┘
```

---

## 📝 إدارة الأسئلة (Questions Management)

### 🚨 **3 طرق لإضافة الأسئلة:**

#### **Method 1: Manual Entry (يدوي - حبة حبة)**
```
الأدمن يدخل:
- السؤال (بالعربي)
- الخيارات (4 خيارات)
- الإجابة الصحيحة (اختيار 1-4)
- الشرح (اختياري)
- الفصل (اختياري)
- نوع الاختبار (اختياري)
- المادة (اختيار من القائمة)

Click Save → السؤال يضاف!
```

#### **Method 2: JSON File Upload (رفع ملف JSON)**
```
الأدمن يرفع ملف JSON:

{
  "courseId": "PSY101",
  "questions": [
    {
      "questionAr": "ما هو علم النفس؟",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
      "correctIndex": 0,
      "explanation": "الشرح هنا",
      "chapter": "الفصل الأول",
      "examType": "midterm"
    },
    {
      "questionAr": "سؤال ثاني؟",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
      "correctIndex": 2,
      "explanation": "شرح ثاني",
      "chapter": "الفصل الثاني",
      "examType": "final"
    }
  ]
}

System imports ALL questions automatically!
يمكن رفع ملفات JSON غير محدودة!
```

#### **Method 3: Excel File Upload (رفع ملف Excel) ⭐**
```
الأدمن يرفع ملف Excel (.xlsx):

| Question | Option1 | Option2 | Option3 | Option4 | Correct | Explanation | Chapter | ExamType |
|----------|---------|---------|---------|---------|---------|-------------|---------|----------|
| سؤال 1   | خيار 1  | خيار 2  | خيار 3  | خيار 4  | 0       | شرح 1       | فصل 1   | midterm  |
| سؤال 2   | خيار 1  | خيار 2  | خيار 3  | خيار 4  | 2       | شرح 2       | فصل 2   | final    |

System reads Excel → Imports all questions → Done!
يمكن رفع ملفات Excel غير محدودة!
```

**🎯 ملاحظات:**
- ✅ الأدمن يختار أي طريقة (يدوي/JSON/Excel)
- ✅ يمكن المزج (بعض يدوي، بعض JSON، بعض Excel)
- ✅ جميع الأسئلة تظهر فورًا على الموقع

---

## 📄 إدارة الملخصات (Summaries Management)

### 🚨 **دعم ملفات متعددة:**

#### **الملفات المدعومة:**
```
✅ PDF files (.pdf)
✅ Word files (.docx, .doc)
✅ PowerPoint files (.pptx, .ppt)
✅ Image files (.jpg, .png, .webp)
✅ Any file type!
```

#### **العملية:**
```
Admin Panel → Summaries → Add Summary

1. Click "Add Summary"
2. Select course (dropdown)
3. Enter title: "Chapter 1 Summary"
4. Upload file (browse computer)
   - يمكن رفع: PDF, Word, PowerPoint, Image, أو أي ملف!
5. Set chapter name (optional)
6. Set order number (for sorting)
7. Click Save

System:
- Uploads file to Firebase Storage
- Generates download URL
- Detects file type automatically
- Saves to database
- File appears on course page immediately!
```

#### **الأدمن يقدر:**
```
✅ Upload unlimited files
✅ Any file type (PDF, Word, PPT, Image, etc.)
✅ Any file size (system handles it)
✅ Replace existing files
✅ Delete files
✅ Reorder summaries (drag & drop)
✅ Enable/disable summaries
✅ Set custom names for each file
```

#### **أمثلة:**
```
PSY101 Course:
- Admin uploads "Chapter_1.pdf" → Shows as "ملخص الفصل الأول"
- Admin uploads "Notes.docx" → Shows as "ملاحظات الوورد"
- Admin uploads "Slides.pptx" → Shows as "عرض الباوربوينت"
- Admin uploads "Diagram.png" → Shows as "رسم توضيحي"

Each file gets:
- Download link
- File type icon (PDF, Word, PPT, Image icons)
- File size display
- File type label
- Last updated date
- View count (optional)
```

**🎯 Key Point: الأدمن عنده حرية كاملة في رفع أي نوع ملف للملخصات!**

---

## 🗂️ البنية في Firebase (Future)

### **البنية المقترحة:**

```javascript
// Level 1: الجهات
institutions/
  kau/
    nameAr: "جامعة الملك عبدالعزيز"
    hasCategories: true

  aramco/
    nameAr: "برنامج أرامكو"
    hasCategories: false

// Level 2: التقسيمات (اختياري!)
categories/
  cs_kau/
    institutionId: "kau"
    nameAr: "كلية الحاسب"

// Level 3: المواد
courses/
  psy101/
    nameAr: "علم النفس 101"
    institutionId: "kau"
    categoryId: "arts"  // أو null لو بدون تقسيم

// الكويزات (تعريف كل كويز)
quizzes/
  midterm1_psy101/
    courseId: "psy101"
    nameAr: "اختبار الميد الأول"
    questionsCount: 15

// الأسئلة (منظمة بـ quizId)
questions/
  q1/
    courseId: "psy101"
    quizId: "midterm1"
    questionAr: "ما هو..."
    options: [...]
    correctIndex: 0

// الملخصات (ملفات متعددة)
summaries/
  sum1_psy101/
    courseId: "psy101"
    title: "ملخص الفصل الأول"
    fileUrl: "https://storage.../summary.pdf"
    fileType: "pdf"  // pdf, docx, pptx, image, etc.
    fileSize: 2.5  // MB
    fileName: "Chapter_1.pdf"
    order: 1
    isActive: true
    uploadedAt: timestamp

  sum2_psy101/
    courseId: "psy101"
    title: "ملاحظات الوورد"
    fileUrl: "https://storage.../notes.docx"
    fileType: "docx"
    fileSize: 1.2  // MB
    fileName: "Notes.docx"
    order: 2
    isActive: true
    uploadedAt: timestamp
```

---

## 🛣️ Routes المطلوبة (Next Steps)

### **Routes الحالية:**
```
✅ /browse                                    → Browse.jsx
✅ /browse/:institutionId                     → Institution.jsx
✅ /browse/:institutionId/:categoryId         → Courses.jsx
```

### **Routes المفقودة (يجب إضافتها):**
```
❌ /browse/:institutionId/:categoryId/course/:courseId
   → CourseDetails.jsx (للمواد مع تقسيم)

❌ /browse/:institutionId/course/:courseId
   → CourseDetails.jsx (للمواد بدون تقسيم)

❌ /browse/.../course/:courseId/quiz/:quizId
   → QuizPage.jsx (صفحة الاختبار)

❌ /browse/.../course/:courseId/quiz/:quizId/results
   → QuizResults.jsx (صفحة النتائج)
```

### **الRoute المرن (يدعم الحالتين):**
```javascript
// Option 1: Route منفصل لكل حالة
/browse/:institutionId/course/:courseId
/browse/:institutionId/:categoryId/course/:courseId

// Option 2: Route واحد مع optional categoryId (الأفضل!)
/browse/:institutionId/:categoryId?/course/:courseId
// categoryId? = optional parameter
```

---

## 📝 CourseDetails.jsx - البنية المقترحة

### **المكونات المطلوبة:**

1. **Course Header:**
   - اسم المادة
   - الوصف
   - الإحصائيات (عدد الكويزات، عدد الملخصات)

2. **Quizzes Section:**
   - قائمة الكويزات
   - زر "ابدأ الاختبار" لكل كويز
   - معلومات (عدد الأسئلة، المدة)

3. **Summaries Section:**
   - قائمة الملخصات (PDF, Word, PPT, Images, etc.)
   - زر "تحميل" لكل ملف
   - معلومات (نوع الملف، حجم الملف)
   - أيقونة نوع الملف

### **المكونات الجديدة المطلوبة:**
```
src/components/course/
├── QuizCard.jsx          ← كارد كل كويز
├── SummaryCard.jsx       ← كارد كل ملخص
└── CourseHeader.jsx      ← هيدر صفحة المادة
```

---

## 🔄 Flow Chart

```
الطالب يبدأ:
    ↓
/browse (الجهات)
    ↓
/browse/:institutionId
    ├─ hasCategories: true  → عرض Categories
    └─ hasCategories: false → عرض Courses مباشرة
    ↓
/browse/:institutionId/:categoryId (لو hasCategories)
    → عرض Courses
    ↓
/browse/.../course/:courseId (NEW!)
    → CourseDetails.jsx
    ├─ Quizzes Section
    └─ Summaries Section
    ↓
/browse/.../course/:courseId/quiz/:quizId (NEW!)
    → QuizPage.jsx (10 أسئلة لكل صفحة)
    ↓
/browse/.../course/:courseId/quiz/:quizId/results (NEW!)
    → QuizResults.jsx
```

---

## ✅ الخطوات التالية (Implementation Steps)

### **Step 1: Update Routes**
```javascript
// في App.jsx
<Route path="/browse/:institutionId/:categoryId?/course/:courseId" 
       element={<CourseDetails />} />
```

### **Step 2: Create CourseDetails.jsx**
- استيراد بيانات المادة
- عرض الكويزات والملخصات
- Routing للكويزات

### **Step 3: Create Components**
- `QuizCard.jsx`
- `SummaryCard.jsx`
- `CourseHeader.jsx`

### **Step 4: Update CourseCard**
- تغيير Link ليوجه لـ CourseDetails
- دعم categoryId optional

### **Step 5: Create Quiz System**
- QuizPage.jsx
- تقسيم الأسئلة (10 لكل صفحة)
- حفظ الإجابات

### **Step 6: Create Results Page**
- QuizResults.jsx
- عرض النتيجة
- عرض الإجابات الخاطئة

---

## 📊 ملخص البنية الحالية

| الميزة | الحالة | الملاحظات |
|--------|--------|-----------|
| `hasCategories` | ✅ موجود | يدعم true/false |
| Routes الأساسية | ✅ موجود | يدعم الحالتين |
| Institution.jsx | ✅ موجود | يعرض Categories أو Courses |
| Courses.jsx | ✅ موجود | يعرض قائمة المواد |
| CourseDetails | ❌ مفقود | **يجب إضافته!** |
| Quiz System | ❌ مفقود | **يجب إضافته!** |
| Summaries System | ❌ مفقود | **يجب إضافته!** |
| Questions (3 methods) | ❌ مفقود | يدوي/JSON/Excel |
| File Types Support | ❌ مفقود | PDF/Word/PPT/Image |

---

## 🎯 الخلاصة

✅ **البنية الحالية جاهزة 100%** للمرونة اللي شرحتها!

❌ **باقي فقط:**
- صفحة تفاصيل المادة (CourseDetails)
- نظام الكويزات
- نظام الملخصات

🚀 **جاهز للتنفيذ!**
