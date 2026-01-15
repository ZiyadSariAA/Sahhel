# 🔥 دليل شامل: Firebase Cloud Functions - من الصفر حتى النشر

## 📋 جدول المحتويات

1. [ما هي Firebase Functions؟](#ما-هي-firebase-functions)
2. [البداية: لماذا استخدمنا Functions؟](#البداية-لماذا-استخدمنا-functions)
3. [الإعداد الأولي](#الإعداد-الأولي)
4. [إنشاء أول Function](#إنشاء-أول-function)
5. [إرسال الإيميلات (Email Functions)](#إرسال-الإيميلات-email-functions)
6. [مشاكل واجهناها وحلولها](#مشاكل-واجهناها-وحلولها)
7. [النشر والاختبار](#النشر-والاختبار)
8. [الخلاصة](#الخلاصة)

---

## 🎯 ما هي Firebase Functions؟

**Firebase Cloud Functions** هي **كود JavaScript/TypeScript** يشغل على **سيرفرات Google** تلقائياً عند حدوث أحداث معينة.

### أنواع Functions:

#### 1️⃣ **HTTP Functions** (يستدعى من الموقع)
```javascript
exports.sendThankYouEmail = functions.https.onRequest((request, response) => {
  // يتم استدعاؤها من الموقع مباشرة
});
```

#### 2️⃣ **Auth Triggers** (تشتغل عند تسجيل/دخول المستخدم)
```javascript
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  // تشتغل تلقائياً عند تسجيل مستخدم جديد
});
```

#### 3️⃣ **Firestore Triggers** (تشتغل عند تغيير البيانات)
```javascript
exports.onQuizCompleted = functions.firestore
  .document('users/{userId}/quizResults/{resultId}')
  .onCreate(async (snap, context) => {
    // تشتغل عند إضافة نتيجة اختبار جديدة
  });
```

#### 4️⃣ **Scheduled Functions** (تشتغل على جدول زمني)
```javascript
exports.cleanupOldData = functions.pubsub
  .schedule('0 0 * * 0') // كل أسبوع
  .onRun(async (_context) => {
    // تشتغل كل أسبوع تلقائياً
  });
```

---

## 🚀 البداية: لماذا استخدمنا Functions؟

### المشكلة:
- **المستخدم يضغط زر "شكراً"** في الموقع
- **نريد إرسال إيميل** للمستخدم
- **لا نستطيع إرسال إيميل من المتصفح مباشرة** (مشاكل أمان)

### الحل:
- **نستخدم Firebase Functions** كـ **وسيط**
- **الموقع يرسل طلب** للـ Function
- **الـ Function ترسل الإيميل** من السيرفر

---

## ⚙️ الإعداد الأولي

### الخطوة 1: تثبيت Firebase CLI

```bash
npm install -g firebase-tools
```

### الخطوة 2: تسجيل الدخول

```bash
npx firebase login
```

**ملاحظة مهمة:** تأكد أنك تسجل دخول بالحساب الصحيح! (كان عندنا مشكلة لأننا دخلنا من حساب ثاني)

### الخطوة 3: تهيئة Functions في المشروع

```bash
firebase init functions
```

**ما يحدث:**
- ينشئ مجلد `functions/`
- ينشئ `functions/package.json`
- ينشئ `functions/index.js`
- يضيف إعدادات في `firebase.json`

### الخطوة 4: تحديث `firebase.json`

```json
{
  "functions": {
    "source": "functions"
  }
}
```

---

## 📝 إنشاء أول Function

### الملف: `functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// تهيئة Firebase Admin
admin.initializeApp();

// أول Function بسيطة
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.json({ message: 'Hello from Firebase!' });
});
```

### نشر الـ Function:

```bash
npx firebase deploy --only functions:helloWorld
```

### النتيجة:
```
Function URL: https://us-central1-sahhel-org.cloudfunctions.net/helloWorld
```

---

## 📧 إرسال الإيميلات (Email Functions)

### الخطوة 1: تثبيت المكتبات المطلوبة

```bash
cd functions
npm install nodemailer cors
```

**المكتبات:**
- **`nodemailer`**: لإرسال الإيميلات
- **`cors`**: للسماح بالطلبات من الموقع (CORS)

### الخطوة 2: إعداد Email Configuration

#### ❌ الطريقة القديمة (مهملة):
```javascript
// ❌ هذا الكود مهمل الآن
const emailUser = functions.config().email.user;
const emailPass = functions.config().email.pass;
```

#### ✅ الطريقة الجديدة (Secrets):
```javascript
// ✅ نستخدم Firebase Secrets
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
```

### الخطوة 3: إنشاء Email Transporter

```javascript
const nodemailer = require('nodemailer');

const getEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('⚠️ Email config not set');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};
```

### الخطوة 4: إنشاء Function لإرسال إيميل الشكر

```javascript
const cors = require('cors')({ origin: true });

exports.sendThankYouEmail = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] }) // ⚠️ مهم جداً!
  .https.onRequest((request, response) => {
    return cors(request, response, async () => {
      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { email, name } = request.body;

      if (!email) {
        response.status(400).json({ error: 'Email is required' });
        return;
      }

      const transporter = getEmailTransporter();
      if (!transporter) {
        response.status(200).json({ 
          success: true, 
          message: 'Demo mode - email not actually sent',
          demo: true
        });
        return;
      }

      const mailOptions = {
        from: 'سهّل Sahhel <nasabnihelp@gmail.com>',
        to: email,
        subject: 'شكراً لك! 🙏',
        html: `<!-- HTML template -->`
      };

      try {
        await transporter.sendMail(mailOptions);
        response.status(200).json({ 
          success: true, 
          message: 'Email sent successfully' 
        });
      } catch (error) {
        response.status(500).json({ 
          error: 'Failed to send email',
          message: error.message 
        });
      }
    });
  });
```

### الخطوة 5: إعداد Gmail App Password

#### لماذا App Password؟
- Gmail **لا يسمح** باستخدام كلمة المرور العادية
- **"Less Secure Apps"** متوقفة منذ مايو 2022
- **الحل:** استخدام **App Password**

#### خطوات الحصول على App Password:

1. **تفعيل التحقق بخطوتين:**
   - اذهب: https://myaccount.google.com/security
   - فعّل **"2-Step Verification"**

2. **إنشاء App Password:**
   - اذهب: https://myaccount.google.com/apppasswords
   - اختر **"Mail"** → **"Other"** → اكتب **"Sahhel"**
   - اضغط **"Generate"**
   - **انسخ الـ 16 حرف** (مثل: `qvgd vcji jnik vhoj`)

3. **إعداد Secret في Firebase:**
   ```bash
   # إعداد EMAIL_USER
   echo nasabnihelp@gmail.com | npx firebase functions:secrets:set EMAIL_USER
   
   # إعداد EMAIL_PASS (استخدم App Password)
   echo qvgdvcjijnikvhoj | npx firebase functions:secrets:set EMAIL_PASS
   ```

### الخطوة 6: إنشاء Function لإرسال إيميل ترحيبي

```javascript
exports.createUserDocument = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] })
  .auth.user().onCreate(async (user) => {
    // إنشاء مستند المستخدم في Firestore
    await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        email: user.email,
        displayName: user.displayName || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // ... باقي البيانات
      });
    
    // إرسال إيميل ترحيبي
    const transporter = getEmailTransporter();
    if (transporter && user.email) {
      const welcomeMailOptions = {
        from: 'سهّل Sahhel <nasabnihelp@gmail.com>',
        to: user.email,
        subject: 'مرحباً بك في سهّل! 🎉',
        html: `<!-- HTML template -->`
      };
      
      try {
        await transporter.sendMail(welcomeMailOptions);
        console.log(`📧 Welcome email sent to ${user.email}`);
      } catch (error) {
        console.error('❌ Error sending welcome email:', error);
      }
    }
    
    return null;
  });
```

---

## 🐛 مشاكل واجهناها وحلولها

### المشكلة 1: "The caller does not have permission"

**السبب:**
- الحساب المستخدم ليس له صلاحيات كافية
- أو تسجيل دخول من حساب خاطئ

**الحل:**
```bash
# تسجيل خروج
npx firebase logout

# تسجيل دخول بالحساب الصحيح
npx firebase login

# التحقق من المشروع
npx firebase projects:list
```

### المشكلة 2: "Runtime Node.js 18 was decommissioned"

**السبب:**
- Node.js 18 متوقف منذ أكتوبر 2025

**الحل:**
عدّل `functions/package.json`:
```json
{
  "engines": {
    "node": "20"  // ✅ غير من 18 إلى 20
  }
}
```

### المشكلة 3: "Secret not found"

**السبب:**
- الـ Secrets غير معدّة
- أو الـ Function ما تستخدم `runWith({ secrets: [...] })`

**الحل:**
```javascript
// ❌ خطأ
exports.sendThankYouEmail = functions.https.onRequest(...)

// ✅ صحيح
exports.sendThankYouEmail = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] })
  .https.onRequest(...)
```

### المشكلة 4: CORS Error

**السبب:**
- المتصفح يمنع الطلبات من الموقع للـ Function
- الـ Function ما تدعم CORS

**الحل:**
```javascript
const cors = require('cors')({ origin: true });

exports.sendThankYouEmail = functions
  .https.onRequest((request, response) => {
    return cors(request, response, async () => {
      // الكود هنا
    });
  });
```

### المشكلة 5: الإيميلات ما توصل

**الأسباب المحتملة:**

1. **App Password غير صحيح:**
   - تأكد أنك استخدمت App Password وليس كلمة المرور العادية
   - تأكد أن التحقق بخطوتين مفعّل

2. **الـ Secrets غير معدّة:**
   - تحقق: `npx firebase functions:secrets:access EMAIL_USER`
   - تحقق: `npx firebase functions:secrets:access EMAIL_PASS`

3. **عنوان المرسل غير موثوق:**
   - استخدم الإيميل الفعلي: `nasabnihelp@gmail.com`
   - لا تستخدم: `noreply@sahhel.com` (غير موجود)

4. **الإيميل في Spam:**
   - تحقق من مجلد Spam في Gmail
   - تحقق من مجلد Promotions

5. **Gmail يرفض الإرسال:**
   - تحقق من Firebase Functions Logs
   - قد تحتاج استخدام خدمة خارجية (SendGrid, Mailgun)

---

## 🚀 النشر والاختبار

### 1. نشر Function واحدة:

```bash
npx firebase deploy --only functions:sendThankYouEmail
```

### 2. نشر كل الـ Functions:

```bash
npx firebase deploy --only functions
```

### 3. اختبار الـ Function:

#### من المتصفح:
```javascript
fetch('https://us-central1-sahhel-org.cloudfunctions.net/sendThankYouEmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@gmail.com',
    name: 'Test User'
  })
})
.then(r => r.json())
.then(console.log)
```

#### من الموقع:
- اضغط زر "شكراً" في الـ Navbar
- تحقق من الإيميل

### 4. مراقبة Logs:

```bash
npx firebase functions:log
```

أو من Firebase Console:
```
https://console.firebase.google.com/project/sahhel-org/functions/logs
```

---

## 📁 هيكل المشروع النهائي

```
Sahhel/
├── functions/
│   ├── index.js          # كل الـ Functions هنا
│   ├── package.json      # المكتبات المطلوبة
│   └── .eslintrc.js     # إعدادات ESLint
├── firebase.json         # إعدادات Firebase
└── .firebaserc          # معرف المشروع
```

---

## 🔑 نقاط مهمة جداً

### 1. Secrets vs Environment Variables

**❌ خطأ:**
```javascript
const emailUser = process.env.EMAIL_USER; // بدون runWith
```

**✅ صحيح:**
```javascript
exports.myFunction = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] })
  .https.onRequest((request, response) => {
    const emailUser = process.env.EMAIL_USER; // ✅ يعمل الآن
  });
```

### 2. CORS ضروري للـ HTTP Functions

**❌ بدون CORS:**
```javascript
exports.sendThankYouEmail = functions.https.onRequest((request, response) => {
  // ❌ CORS error من المتصفح
});
```

**✅ مع CORS:**
```javascript
const cors = require('cors')({ origin: true });

exports.sendThankYouEmail = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    // ✅ يعمل بدون مشاكل
  });
});
```

### 3. عنوان المرسل يجب أن يكون موثوق

**❌ خطأ:**
```javascript
from: 'سهّل <noreply@sahhel.com>' // ❌ هذا الدومين غير موجود
```

**✅ صحيح:**
```javascript
from: 'سهّل Sahhel <nasabnihelp@gmail.com>' // ✅ الإيميل الفعلي
```

### 4. App Password وليس كلمة المرور العادية

**❌ خطأ:**
```javascript
// استخدام كلمة المرور العادية
pass: 'my-password-123'
```

**✅ صحيح:**
```javascript
// استخدام App Password (16 حرف)
pass: 'qvgdvcjijnikvhoj'
```

---

## 📊 ملخص الـ Functions الموجودة

### 1. `sendThankYouEmail`
- **النوع:** HTTP Function
- **الاستخدام:** إرسال إيميل شكر عند الضغط على زر "شكراً"
- **الـ URL:** `https://us-central1-sahhel-org.cloudfunctions.net/sendThankYouEmail`

### 2. `createUserDocument`
- **النوع:** Auth Trigger
- **الاستخدام:** إنشاء مستند المستخدم + إرسال إيميل ترحيبي عند التسجيل
- **التشغيل:** تلقائي عند `user().onCreate()`

### 3. `onQuizCompleted`
- **النوع:** Firestore Trigger
- **الاستخدام:** تحديث إحصائيات المستخدم عند إكمال اختبار
- **التشغيل:** تلقائي عند إضافة `quizResults`

### 4. `cleanupOldData`
- **النوع:** Scheduled Function
- **الاستخدام:** حذف البيانات القديمة (أقدم من 6 أشهر)
- **التشغيل:** كل أسبوع تلقائياً

### 5. `helloWorld`
- **النوع:** HTTP Function
- **الاستخدام:** اختبار بسيط
- **الـ URL:** `https://us-central1-sahhel-org.cloudfunctions.net/helloWorld`

---

## 🎓 الخلاصة

### ما تعلمناه:

1. ✅ **Firebase Functions** هي كود يشغل على سيرفرات Google
2. ✅ **HTTP Functions** تستدعى من الموقع
3. ✅ **Auth Triggers** تشتغل تلقائياً عند تسجيل مستخدم
4. ✅ **Secrets** ضرورية لحفظ البيانات الحساسة
5. ✅ **CORS** ضروري للسماح بالطلبات من الموقع
6. ✅ **App Password** مطلوب لإرسال إيميلات من Gmail
7. ✅ **Node.js 20** هو الإصدار المطلوب الآن

### الخطوات الأساسية:

1. **إعداد:** `firebase init functions`
2. **كتابة الكود:** في `functions/index.js`
3. **إعداد Secrets:** `firebase functions:secrets:set`
4. **النشر:** `firebase deploy --only functions`
5. **الاختبار:** من الموقع أو المتصفح

---

## 📚 مراجع مفيدة

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Firebase Secrets](https://firebase.google.com/docs/functions/config-env)

---

## ✨ نهاية الدليل

هذا الدليل يغطي **كل شيء** من البداية حتى النشر. إذا واجهت أي مشكلة، راجع قسم **"مشاكل واجهناها وحلولها"** أو راجع الـ Logs في Firebase Console.

**تم كتابة هذا الدليل:** 15 يناير 2026  
**آخر تحديث:** بعد إصلاح جميع المشاكل ونشر الـ Functions بنجاح

---

**🎉 مبروك! الآن أنت تعرف كل شيء عن Firebase Functions!**
