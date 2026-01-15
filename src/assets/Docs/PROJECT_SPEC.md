# SAHHEL (سهّل) - FINAL PROJECT SPECIFICATION

## 🎯 PROJECT OVERVIEW

Mobile-first study platform for university students combining quizzes, summaries (PDF, Word, PPT, Images, etc.), and focus/productivity tools.

---

## ⚠️ CRITICAL: TWO COMPLETELY SEPARATE PROJECTS

### 🟦 PROJECT #1: MAIN STUDENT WEBSITE
```
Purpose: Public website for students
URL: sahhel.com
Users: Students (everyone)
Features:
- Browse courses
- Take quizzes  
- Download summaries (PDF, Word, PPT, Images, etc.)
- Use Focus Hub
Technology: 
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Animations: Framer Motion + AutoAnimate + Lottie
- Backend: Firebase (Auth + Firestore + Storage)
- Hosting: Vercel
```

### 🟥 PROJECT #2: ADMIN PANEL (COMPLETELY SEPARATE!)
```
Purpose: Content management system
URL: admin.sahhel.com (different domain!)
Users: Admins ONLY
Features:
- Create site structure
- Upload questions (JSON/Excel/Manual)
- Upload summaries (PDF, Word, PPT, Images, etc.)
- Manage everything
Technology:
- Frontend: React + Vite + Tailwind CSS + MUI
- Tables: TanStack Table + MUI DataGrid
- Backend: Firebase (Auth + Firestore + Storage)
- Hosting: Vercel (separate deployment)

🚨 IMPORTANT:
- SEPARATE codebase (different folder/repo)
- SEPARATE deployment (different server)
- SEPARATE authentication (admin login)
- SEPARATE domain/subdomain
- Students NEVER see it
- Students NEVER access it
- NOT part of main website
```

**These are TWO DIFFERENT APPLICATIONS that talk to the same database!**

---

## 🛠 TECHNOLOGY STACK

### **Backend (Firebase Only)**
```
✅ Firebase Authentication (User & Admin login)
✅ Firebase Firestore (Database)
✅ Firebase Storage (PDF uploads)
✅ Firebase Functions (Optional - if needed)
```

**Note:** No Node.js, Express, or SQL Database needed. Firebase handles everything.

---

### **PROJECT #1: MAIN WEBSITE STACK**

#### **Core Foundation**
```
✅ Vite (Build tool - ultra-fast)
✅ React (UI framework)
✅ JavaScript (ES6+) - No TypeScript
✅ ESLint + Prettier (Code quality)
```

#### **Styling System**
```
✅ Tailwind CSS (Utility-first styling)
✅ shadcn/ui (Premium components)
✅ Radix UI (Accessible UI primitives)
✅ CSS Variables + Design Tokens (Colors, spacing)
✅ clsx / class-variance-authority (Conditional styles)
```

#### **Icons & Visual**
```
✅ Lucide React (Main icons - clean & modern)
✅ Heroicons (Additional icons)
✅ React Icons (When needed)
✅ Google Fonts (Tajawal for Arabic, Inter for English)
```

#### **Animations**
```
✅ Framer Motion (Main animations - page transitions, hover effects)
✅ AutoAnimate (Automatic animations for lists & dynamic content)
✅ React Intersection Observer (Scroll-triggered animations)
✅ Lenis (Smooth scrolling)
✅ Lottie React (High-quality animations - Hero sections, Loading)
```

#### **Forms & UX**
```
✅ React Hook Form (Fast forms, minimal re-renders)
✅ Zod (Schema validation)
✅ @hookform/resolvers (Connects Zod to forms)
✅ Sonner (Beautiful toast notifications)
```

#### **Data Fetching & State**
```
✅ TanStack Query (React Query - caching, loading states)
✅ Zustand (Lightweight global state - simpler than Redux)
✅ Firebase SDK (Authentication, Firestore, Storage)
```

#### **Performance Optimization**
```
✅ React.lazy + Suspense (Code splitting)
✅ useMemo / useCallback (Prevent re-renders)
✅ vite-plugin-compression (Gzip/Brotli compression)
✅ rollup-plugin-visualizer (Bundle size analysis)
```

#### **Premium UX Libraries**
```
✅ Floating UI (Tooltips, Popovers, Dropdown positioning)
✅ Embla Carousel (Lightweight carousel - if needed)
```

#### **Images & Media**
```
✅ WebP / AVIF formats (Optimized images)
✅ Manual optimization (Squoosh/TinyPNG)
```

#### **Routing**
```
✅ React Router (Page navigation)
```

---

### **PROJECT #2: ADMIN PANEL STACK**

#### **Core Foundation**
```
✅ Vite (Build tool)
✅ React (UI framework)
✅ JavaScript (ES6+)
✅ ESLint + Prettier
```

#### **Styling System**
```
✅ Tailwind CSS (Utility-first styling)
✅ Material UI (MUI) - Perfect for admin dashboards, tables, forms
✅ shadcn/ui (Base components)
✅ clsx / class-variance-authority (Conditional styles)
```

#### **Tables & Data Management**
```
✅ TanStack Table (Powerful tables - sorting, filtering, pagination)
✅ MUI DataGrid (Beautiful admin tables)
✅ dnd-kit (Drag & drop - reordering items)
```

#### **Forms & Validation**
```
✅ React Hook Form
✅ Zod
✅ @hookform/resolvers
✅ Sonner (Notifications)
```

#### **Data Fetching & State**
```
✅ TanStack Query
✅ Zustand
✅ Firebase SDK (Admin)
```

#### **File Upload & Processing**
```
✅ Firebase Storage SDK
✅ Excel/JSON parsing libraries (For question imports)
```

#### **Icons**
```
✅ Lucide React
✅ Heroicons
✅ Material Icons (MUI)
```

---

### **Hosting & Deployment**

```
✅ Vercel (Frontend hosting - Main Website)
✅ Vercel (Admin Panel - separate deployment)
✅ Firebase Hosting (Optional alternative)
```

---

### **Monitoring (Optional)**

```
✅ Sentry (Error tracking)
✅ Firebase Analytics (User analytics)
✅ UptimeRobot (Uptime monitoring - optional)
```

---

### **Libraries to AVOID**

```
❌ TypeScript (Not in spec)
❌ Next.js (Using Vite instead)
❌ Redux (Using Zustand - lighter)
❌ Axios (Using Fetch or Firebase SDK)
❌ Cloudinary (Using Firebase Storage)
❌ Node.js/Express (Using Firebase only)
❌ SQL Databases (Using Firestore)
```

---

## 🚀 MVP LAUNCH FEATURES

### ✅ Phase 1 (First Launch):
- Quizzes
- Summaries (PDF, Word, PPT, Images, etc.)  
- Focus Hub
- Admin panel (separate project)

### ❌ Phase 2 (Later):
- Jobs marketplace
- Premium subscriptions

---

## 🎨 DESIGN SYSTEM & BRANDING

### **Logo**
```
Design: Simple and modern
- Icon: Book or letter "س" (from "سهّل")
- Text: "سهّل" in elegant Arabic font
- Style: Minimal, clean, professional
```

### **Color Palette**

#### **Light Mode (Default)**
```
Primary Color: #7AA598 (Muted Sage Teal)
- Main brand color from logo
- Used for headers, primary buttons, links
- Represents calmness, growth, and trust
- WCAG AA compliant (4.81:1 on white for large text)
- Muted tone reduces eye strain during long study sessions

Accent Color: #D4A294 (Muted Terracotta/Taupe)
- Complementary warm accent
- Interactive elements (CTAs, highlights)
- Hover states and attention-grabbing elements
- WCAG AA compliant (4.63:1 on white for large text)
- Subtle warmth balances cool primary

Background: #FFFFFF (White)
- Main page background
- Clean and professional

Secondary Background: #F4F8F6 (Soft Mint White)
- Section backgrounds with subtle sage tint
- Card backgrounds
- Matches logo background aesthetic

Text Colors:
- Primary Text: #1F2421 (Near Black with sage undertone) - 16.81:1 contrast
- Secondary Text: #5A6662 (Medium Sage Gray) - 6.94:1 contrast
- Muted Text: #8F9A96 (Light Sage Gray) - 4.51:1 contrast

Borders: #DCE7E2 (Light Sage Border)
```

#### **Dark Mode**
```
Primary Color: #9CBDB1 (Lighter Muted Sage)
- Adjusted for dark backgrounds
- Maintains brand identity and logo connection
- WCAG AA compliant (6.23:1 on dark)

Accent Color: #E8B8A8 (Light Muted Coral)
- Adjusted for dark backgrounds
- Maintains visibility and warmth
- WCAG AA compliant (7.02:1 on dark)

Background: #1A1A1A (Dark Gray)
- Main page background

Secondary Background: #242928 (Dark Sage Gray)
- Section backgrounds with sage undertone
- Card backgrounds

Text Colors:
- Primary Text: #F4F8F6 (Off-White with mint tint) - 15.23:1 contrast
- Secondary Text: #B8C7C2 (Light Sage Gray) - 9.12:1 contrast
- Muted Text: #8F9A96 (Medium Sage Gray) - 5.23:1 contrast

Borders: #3A4440 (Dark Sage Border)
```

### **Color Psychology & Brand Alignment**
```
The muted sage green/teal color scheme was chosen to match the logo and provide:
- Reduced eye strain during long study sessions (2-3+ hours)
- Calm, focused learning environment
- Professional, trustworthy brand perception
- Growth and development symbolism
- Natural, balanced aesthetic
- Unique positioning vs. typical blue/purple ed-tech platforms
- Cultural appropriateness for Middle Eastern audiences

The muted terracotta/taupe accent provides:
- Complementary color harmony
- Clear visual hierarchy for CTAs
- Warmth to balance cool primary
- High accessibility contrast ratios
- Sophisticated, premium feel
```

### **Theme Toggle**
```
- Toggle button in header/navigation
- User preference saved in:
  - LocalStorage (for guest users)
  - Firebase (for registered users)
- Smooth transition between themes
- System preference detection (optional)
```

### **Design Principles**
```
✅ Mobile-first design
✅ Clean and minimal
✅ Easy to read (high contrast)
✅ Accessible (WCAG AA compliant)
✅ Smooth animations and transitions
✅ Consistent spacing and typography
```

### **Animation Guidelines**

#### **Animation Libraries Usage:**

**Framer Motion (Main - 80% of animations):**
```
- Page transitions
- Button hover effects
- Card animations
- Modal animations
- General UI animations
- Entrance animations
```

**AutoAnimate (Dynamic content):**
```
- Task list updates (Focus Hub)
- Course list changes
- Adding/removing items
- List reordering
```

**React Intersection Observer (Scroll animations):**
```
- Section reveals on scroll
- Lazy loading images
- Animate when elements enter viewport
```

**Lenis (Smooth scrolling):**
```
- Smooth scrolling on all pages
- Better scroll experience
- Apple-like scroll feel
```

**Lottie React (Premium animations):**
```
- Homepage hero animation
- Loading spinner (fancy)
- Success/Error state animations
- Decorative elements
- Use sparingly (only important sections)
```

#### **Animation Best Practices:**
```
✅ Keep animations subtle and smooth
✅ Don't overuse animations (performance)
✅ Use Lottie only for hero/loading sections
✅ Prefer Framer Motion for most animations
✅ Use AutoAnimate for dynamic lists
✅ Ensure animations don't block user interaction
✅ Test on mobile devices (performance)
```

---

## 📱 MAIN WEBSITE (PROJECT #1)

### **Main Pages (3 Pages Only)**

1. **Homepage** - الصفحة الرئيسية
2. **Browse Page** - صفحة التصفح (كل شيء فيها)
3. **Focus Hub** - صفحة Focus Hub

---

### **Homepage**
```
🏠 سهّل
- [Start Studying] → Browse
- [Focus Mode] → Focus Hub
- Admin banner (if enabled)
```

---

### **Browse Page (ONE PAGE FOR EVERYTHING!)**

## 🚨 CRITICAL: ADMIN DECIDES EVERYTHING!

**This is ONE page that shows everything based on what admin creates!**

**Everything happens in the same Browse Page:**
- Shows structure (Universities/Colleges) → Click on college → Shows courses in same page
- Click on course → Shows quizzes and PDFs in same page
- **All in one page, no separate course page!**

### Admin Has COMPLETE Control:

```
Admin Decides:
✅ How many levels? (2 or 3 or 4?)
✅ What categories exist?
✅ What names to use?
✅ How to organize everything?
✅ EVERYTHING is flexible!
```

### Example Structures (Admin's Choice):

**Example A: 3 Levels**
```
Universities → Colleges → Courses

King Abdulaziz University
├── Faculty of Computing
│   ├── CS101 (click → shows quizzes + PDFs in same page)
│   ├── CS102 (click → shows quizzes + PDFs in same page)
│   └── CS201
└── Faculty of Arts
    ├── PSY101 (click → shows quizzes + PDFs in same page)
    └── ARAB101
```

**Example B: 2 Levels**
```
Colleges → Courses

Faculty of Computing
├── CS101 (click → shows quizzes + PDFs in same page)
├── CS102
└── CS201

Technical College
├── IT101
└── IT102
```

**Example C: Custom Categories**
```
Whatever Admin Wants!

Programming Courses
├── CS101 (click → shows quizzes + PDFs in same page)
└── CS102

General Education
├── PSY101
└── ARAB101
```

### **Course Content (Shown in Browse Page)**

When student clicks on a course, the Browse Page shows:

```
📖 PSY101 - Psychology

┌────────────────────────────────┐
│ QUIZZES (if admin adds them)   │
├────────────────────────────────┤
│ Admin decides:                 │
│ - How many quizzes?            │
│ - What names?                  │
│ - What questions?              │
│                                │
│ Examples:                      │
│ • Chapter 1 Quiz               │
│ • Midterm Practice             │
│ • Final Exam                   │
│ • Random Quiz                  │
└────────────────────────────────┘

┌────────────────────────────────┐
│ SUMMARIES (if admin adds them) │
├────────────────────────────────┤
│ Admin decides:                 │
│ - How many PDFs?               │
│ - What names?                  │
│ - What files?                  │
│                                │
│ Examples:                      │
│ • Chapter 1 Summary (PDF)      │
│ • Chapter 2 Summary (PDF)      │
│ • Complete Guide (PDF)         │
└────────────────────────────────┘
```

**Rules:**
- If admin adds NO quizzes → Course shows only summaries
- If admin adds NO summaries → Course shows only quizzes  
- If admin adds BOTH → Course shows both
- If admin adds NOTHING → Course is empty
- **Everything depends on what admin uploads!**
- **All shown in the same Browse Page, not a separate page!**

**🎯 Key Point: The admin creates the ENTIRE structure from scratch. There's NO fixed hierarchy! Everything appears in ONE Browse Page!**

---

### **Quiz Flow**

## 🚨 CRITICAL: Questions are divided into pages!

**Questions are automatically divided into pages (10 questions per page)**

```
1. Student clicks quiz
2. Quiz Page shows:
   - First page: Questions 1-10 (10 questions)
   - Navigation: "Previous Page" / "Next Page"
   - Progress: "Page 1 of 10" (if 100 questions)
   - Student answers questions on current page
   - Answers are saved automatically when moving to next page
3. Student navigates through pages:
   - Page 1: Questions 1-10
   - Page 2: Questions 11-20
   - Page 3: Questions 21-30
   - ... and so on
4. Last page shows "Finish Quiz" button
5. Results page shows:
   - Score
   - Wrong answers
   - Explanations
```

**Rules:**
- **10 questions per page** (automatic division)
- If total questions < 10 → All questions in one page
- If total questions = 25 → Page 1 (1-10), Page 2 (11-20), Page 3 (21-25)
- Answers are saved when moving between pages
- Student can go back to previous pages to change answers
- Progress bar shows current page number

---

### **Focus Hub (Separate Page)**
```
🎯 Focus Hub

Components:
- Tasks (to-do list, manual entry)
- Timer (25 min / 50 min)
- Vibes (Rain, Fire, Nature, Silent)

NOT connected to courses!
Completely independent page!
```

---

## 🔐 USER AUTHENTICATION (Optional Registration)

### 🚨 CRITICAL: Registration is OPTIONAL!

**Users can use the website without registration, but registered users get additional features!**

---

### **Guest User (Without Registration)**

**Can Access:**
```
✅ Browse all courses
✅ Take quizzes
✅ Download summaries (PDF, Word, PPT, Images, etc.)
✅ Use Focus Hub (basic features)
✅ View quiz results
✅ Toggle Dark Mode / Light Mode
```

**Limitations:**
```
❌ Quiz results NOT saved
❌ Progress NOT tracked
❌ Focus Hub saves in LocalStorage only (same device)
❌ NO customizations in Focus Hub:
   - Cannot change Vibes
   - Cannot change Background
   - Cannot customize settings
❌ Cannot access from multiple devices
❌ Theme preference saved in LocalStorage only (same device)
```

**Storage:**
- Focus Hub data saved in **LocalStorage** (local only)
- Theme preference saved in **LocalStorage** (local only)
- Data lost if browser cache cleared
- Data only available on same device

---

### **Registered User (With Account)**

**Can Access:**
```
✅ Everything Guest can do
✅ Quiz results saved in Firebase
✅ Progress tracked and saved
✅ Focus Hub saves in Firebase (cloud)
✅ Customizations available:
   - Change Vibes (custom sounds)
   - Change Background (custom colors/images)
   - Customize Timer settings
   - Advanced settings
✅ Access from multiple devices
✅ Personal dashboard with statistics
✅ View quiz history
✅ Retake quizzes with saved progress
✅ Theme preference saved in Firebase (synced across devices)
```

**Storage:**
- All data saved in **Firebase** (cloud)
- Theme preference saved in **Firebase** (cloud)
- Data synced across all devices
- Data persists even after browser cache cleared

---

### **Focus Hub - Storage & Customization**

**Without Registration:**
```
- Works normally (Timer, Vibes, Tasks)
- Saves in LocalStorage (local only)
- NO customizations:
  ❌ Cannot change Vibes
  ❌ Cannot change Background
  ❌ Cannot customize settings
- Data only on same device
```

**With Registration:**
```
- Works normally (Timer, Vibes, Tasks)
- Saves in Firebase (cloud)
- Full customizations:
  ✅ Can change Vibes (add custom sounds)
  ✅ Can change Background (custom colors/images)
  ✅ Can customize Timer settings
  ✅ Advanced settings available
- Data synced across all devices
```

---

### **Registration Flow**

```
Homepage:
- [Start Studying] → Can use without registration
- [Sign Up] / [Login] → Optional (in header)
- Theme Toggle (Dark/Light) → Available for everyone

Browse Page:
- Can use without registration
- If logged in → Shows "My Progress" / "My Results"
- Theme Toggle available

Focus Hub:
- Can use without registration (LocalStorage)
- If logged in → Full features + Customizations (Firebase)
- Theme Toggle available

Theme Preference:
- Guest users: Saved in LocalStorage (same device)
- Registered users: Saved in Firebase (all devices)
```

---

## 🔧 ADMIN PANEL (PROJECT #2) - COMPLETELY SEPARATE!

### 🚨 THIS IS A DIFFERENT APPLICATION!

```
Location: admin.sahhel.com
Access: Admin login required
Separate: Different code, different deployment
Purpose: Manage ALL content for main website
```

---

### **What Admin Controls (EVERYTHING!)**

#### 1. **Site Structure (100% Flexible)**

```
Admin Creates From Scratch:

Step 1: Create Categories
- Admin decides names
- Admin decides how many levels
- Admin decides organization

Examples:
✅ Create "Universities" (optional)
✅ Create "Colleges" (optional)
✅ Create "Categories" (optional)
✅ Create whatever they want!

Step 2: Create Courses
- Add courses
- Link to categories (however admin wants)
- Set names, codes, icons, colors

Step 3: Organize
- Reorder everything
- Enable/disable items
- Change structure anytime
```

**🎯 Key Point: Admin builds the ENTIRE site structure. Nothing is pre-defined!**

---

#### 2. **Questions Management (Multiple Methods)**

### 🚨 ADMIN CAN ADD QUESTIONS IN 3 WAYS:

**METHOD A: Manual Entry (One by One)**
```
Admin Panel → Questions → Add Question

Form:
- Question text (Arabic)
- Option 1
- Option 2
- Option 3
- Option 4
- Correct answer (select 1-4)
- Explanation (optional)
- Chapter (optional)
- Exam type (optional)
- Course (select from dropdown)

Click Save → Question added!
```

**METHOD B: JSON File Upload (Bulk Import)**
```
Admin Panel → Questions → Import JSON

Admin uploads a .json file:

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
Admin can upload unlimited JSON files!
Each file can contain 1 to 1000+ questions!
```

**METHOD C: Excel File Upload (Bulk Import)**
```
Admin Panel → Questions → Import Excel

Admin uploads .xlsx file with columns:

| Question | Option1 | Option2 | Option3 | Option4 | Correct | Explanation | Chapter | ExamType |
|----------|---------|---------|---------|---------|---------|-------------|---------|----------|
| سؤال 1   | خيار 1  | خيار 2  | خيار 3  | خيار 4  | 0       | شرح 1       | فصل 1   | midterm  |
| سؤال 2   | خيار 1  | خيار 2  | خيار 3  | خيار 4  | 2       | شرح 2       | فصل 2   | final    |
| سؤال 3   | خيار 1  | خيار 2  | خيار 3  | خيار 4  | 1       | شرح 3       | فصل 3   | practice |

System reads Excel → Imports all questions → Done!
Admin can upload unlimited Excel files!
```

**Admin Can Also:**
```
✅ Edit existing questions (one by one)
✅ Delete questions (single or bulk)
✅ Enable/disable questions
✅ Change chapter/exam type for multiple questions at once
✅ Duplicate questions
✅ Search and filter questions
```

**🎯 Key Points:**
- Admin chooses how to add questions (manual, JSON, or Excel)
- Admin can mix methods (some manual, some JSON, some Excel)
- Admin can upload unlimited files
- All questions appear immediately on main website

---

#### 3. **Summaries Management (Multiple File Types)**

### 🚨 ADMIN UPLOADS FILES DIRECTLY! (PDF, Word, PowerPoint, Images, etc.)

```
Admin Panel → Summaries → Add Summary

Process:
1. Click "Add Summary"
2. Select course (dropdown)
3. Enter title: "Chapter 1 Summary"
4. Upload file (browse computer)
   - Supported: PDF, Word (.docx, .doc), PowerPoint (.pptx, .ppt), Images (.jpg, .png, .webp), or any file type
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

**Admin Can:**
```
✅ Upload unlimited files
✅ Any file type (PDF, Word, PowerPoint, Images, etc.)
✅ Any file size (system handles it)
✅ Replace existing files
✅ Delete files
✅ Reorder summaries (drag & drop)
✅ Enable/disable summaries
✅ Set custom names for each file
```

**Examples:**
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

**🎯 Key Point: Admin has COMPLETE control over ALL file types for summaries!**

---

#### 4. **Banner Management**
```
Admin Panel → Banners → Create

Admin controls announcements:
- Title
- Message  
- Link (optional)
- Position (top/bottom)
- Show on pages (home, browse, all)
- Enable/disable
```

---

#### 5. **Analytics**
```
Admin Panel → Analytics

Admin sees:
- Total students
- Quizzes completed
- Files downloaded (PDF, Word, PPT, Images, etc.)
- Popular courses
- Focus sessions
- Engagement metrics
```

---

## 💾 DATABASE (Shared by Both Projects)

```javascript
Firebase Firestore:

// Structure (Admin creates)
universities/ (OPTIONAL - admin decides)
  {id}/ → nameAr, nameEn, logo, isActive, order

colleges/ (OPTIONAL - admin decides)  
  {id}/ → nameAr, nameEn, universityId, isActive, order

courses/ (REQUIRED)
  {courseId}/ → "PSY101" (STABLE ID)
    - nameAr, nameEn, code
    - parentId (links to college or university or category)
    - color, icon, isActive, order

// Content (Admin uploads)
questions/
  {questionId}/
    - courseId: "PSY101"
    - questionAr: string
    - options: ["opt1", "opt2", "opt3", "opt4"]
    - correctIndex: 0-3
    - explanation: string
    - chapter: string
    - examType: string
    - isActive: boolean
    - createdBy: "admin"
    - createdAt: timestamp

summaries/
  {summaryId}/
    - courseId: "PSY101"
    - title: "Chapter 1 Summary"
    - fileUrl: "https://storage.../summary.pdf"
    - fileType: "pdf"  // pdf, docx, pptx, image, etc.
    - fileSize: 2.5 (MB)
    - fileName: "Chapter_1.pdf"
    - chapter: string
    - order: number
    - isActive: boolean
    - uploadedBy: "admin"
    - uploadedAt: timestamp

banners/
  {bannerId}/
    - title, message, link
    - isActive, position, showOnPages

// Users (Optional registration)
users/ (OPTIONAL - only if user registers)
  {userId}/
    - email: string
    - name: string
    - createdAt: timestamp
    - themePreference: "light" | "dark" | "system"
    - quizResults: [
        {
          courseId: "PSY101",
          quizId: string,
          score: number,
          totalQuestions: number,
          answers: [],
          completedAt: timestamp
        }
      ]
    - savedProgress: {
        courseId: {
          lastQuestionIndex: number,
          answers: {}
        }
      }
    - focusHub: {
        tasks: [
          {
            id: string,
            text: string,
            completed: boolean,
            createdAt: timestamp
          }
        ],
        customizations: {
          selectedVibe: "rain" | "fire" | "nature" | "silent" | "custom",
          background: "default" | "gradient-purple" | "custom",
          timerSettings: {
            defaultDuration: 25,
            breakDuration: 5,
            autoStart: boolean
          }
        },
        statistics: {
          totalSessions: number,
          totalMinutes: number,
          lastSessionAt: timestamp
        }
      }
```

---

## 🎯 KEY POINTS SUMMARY

### 1. **Two Separate Projects**
```
Project 1 - Main Website:
- Students use it
- 3 Main Pages: Homepage, Browse Page (everything in one page), Focus Hub
- Browse and take quizzes (all in Browse Page)
- Download summaries (PDF, Word, PPT, Images, etc.) (all in Browse Page)
- Use Focus Hub (separate page)
- sahhel.com
- React + Firebase
- Deployed on Vercel

Project 2 - Admin Panel:
- Admins use it  
- Manage everything
- Upload content
- View analytics
- admin.sahhel.com
- React + Firebase Admin
- Deployed separately
- DIFFERENT CODEBASE
- DIFFERENT DEPLOYMENT
- SEPARATE APPLICATION
```

### 2. **Admin Controls Everything**
```
✅ Site structure (unlimited flexibility)
✅ All categories and levels
✅ All courses
✅ All questions (3 methods: manual/JSON/Excel)
✅ All PDFs (direct upload)
✅ All banners
✅ Everything is customizable!
```

### 3. **Question Import Methods**
```
Method 1: Manual (one question at a time)
Method 2: JSON file (bulk import, unlimited files)
Method 3: Excel file (bulk import, unlimited files)

Admin can use any method or mix them!
```

### 4. **PDF Upload**
```
Admin uploads PDFs directly:
- Any size
- Any number
- Custom names
- Automatic hosting
- Instant availability
```

### 5. **Complete Flexibility**
```
Nothing is pre-defined!
Nothing is automatic!
Everything depends on admin!

If admin doesn't create → Doesn't exist
If admin doesn't upload → Not available
Admin has 100% control!
```

### 6. **Optional User Registration**
```
Registration is OPTIONAL:
- Guest users can use everything (browse, quizzes, PDFs, Focus Hub)
- Guest users: Focus Hub saves in LocalStorage (local only)
- Guest users: NO customizations (Vibes, Background, Settings)
- Registered users: All data saved in Firebase (cloud)
- Registered users: Full customizations available
- Registered users: Access from multiple devices
- Registered users: Quiz results and progress saved
```

### 7. **Dark Mode & Light Mode**
```
Theme Toggle:
- Available for ALL users (guest and registered)
- Light Mode: Default (White background, dark text)
- Dark Mode: Dark background, light text
- Smooth transitions between themes
- Guest users: Preference saved in LocalStorage
- Registered users: Preference saved in Firebase (synced)
- System preference detection (optional)
```

---

## 📋 WORKFLOW EXAMPLE

### Admin Workflow (Project #2):
```
1. Login to admin.sahhel.com
2. Create structure:
   - Add university "KAU"
   - Add college "Faculty of Arts"  
   - Add course "PSY101"
3. Add questions:
   - Upload JSON file with 50 questions
   - Upload Excel file with 30 more questions
   - Add 5 questions manually
   - Total: 85 questions for PSY101
4. Add summaries:
   - Upload "Chapter_1.pdf"
   - Upload "Chapter_2.pdf"
   - Upload "Final_Guide.pdf"
   - Total: 3 PDFs for PSY101
5. Create banner:
   - "Welcome to Sahhel!"
   - Enable on homepage
6. Done! Content is live on main website
```

### Student Workflow (Project #1):
```
Option A: Without Registration (Guest)
1. Visit sahhel.com
2. Click [Start Studying] → Goes to Browse Page
3. Browse Page shows structure (what admin created):
   - KAU → Faculty of Arts
4. Click on "Faculty of Arts" → Courses appear in same Browse Page
5. Click on "PSY101" → Content appears in same Browse Page:
   - 85 questions organized in quizzes
   - 3 summaries available for download (PDF, Word, PPT, etc.)
6. Take quiz or download summaries (PDF, Word, PPT, Images, etc.) (all in same Browse Page)
7. Quiz results shown (NOT saved)
8. Optional: Go to Focus Hub (separate page)
   - Can use Timer, Vibes, Tasks
   - Saves in LocalStorage (local only)
   - NO customizations

Option B: With Registration
1. Visit sahhel.com
2. Click [Sign Up] → Create account (optional)
3. Click [Start Studying] → Goes to Browse Page
4. Same as Option A (steps 3-6)
5. Quiz results saved in Firebase
6. Can view "My Progress" / "My Results"
7. Go to Focus Hub:
   - Can use Timer, Vibes, Tasks
   - Saves in Firebase (cloud)
   - Full customizations (Vibes, Background, Settings)
   - Access from any device
```

---

## ✅ FINAL ONE-SENTENCE SUMMARY

**Two completely separate projects: a student-facing website (sahhel.com) with 3 main pages (Homepage, Browse Page where everything happens in one page, and Focus Hub) where students can browse courses, take quizzes, and download summaries (PDF, Word, PPT, Images, etc.) all in the Browse Page without registration (guest users save Focus Hub data in LocalStorage only), or register for additional features (quiz results saved, progress tracked, Focus Hub customizations with cloud sync), and an admin panel (admin.sahhel.com) as a separate application where admins have 100% control to create the entire site structure, upload questions via manual entry/JSON/Excel, and upload unlimited summaries (PDF, Word, PPT, Images, etc.).**

---

**READY TO BUILD TWO SEPARATE PROJECTS!** 🚀
