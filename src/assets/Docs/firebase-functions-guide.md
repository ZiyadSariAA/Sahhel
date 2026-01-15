# Firebase Functions - Complete Guide

## 📋 Overview

Firebase Functions are **serverless functions** (code that runs on the server) that can be used for data processing, sending notifications, scheduled tasks, and more.

---

## ⚠️ Important Note

**The current project does NOT need Firebase Functions right now!**

- ✅ The project works completely without Functions
- ✅ All core features work from the browser (client-side)
- 🔄 Functions can be added later when needed

---

## 🎯 When Do We Need Firebase Functions?

### 1. **Automatic Notifications**
- Notification when completing a quiz
- Notification when a new summary is uploaded
- Achievement notifications

### 2. **Statistics and Analytics**
- Automatically update course statistics
- Analyze user performance
- Periodic reports

### 3. **File Processing**
- Extract text from PDFs
- Generate thumbnails for images
- Convert file formats

### 4. **Scheduled Tasks**
- Clean up old data
- Automatic backup
- Update statistics

### 5. **Email Sending**
- Welcome email on registration
- Reminder emails
- Weekly reports

---

## 📝 Practical Examples for "Sahhel" Project

### Example 1: Notification on Quiz Completion

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onQuizCompleted = functions.firestore
  .document('users/{userId}/quizResults/{resultId}')
  .onCreate(async (snap, context) => {
    const result = snap.data();
    const userId = context.params.userId;
    
    // Get user data
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const user = userDoc.data();
    
    // Send notification
    if (user.fcmToken) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: 'Congratulations! 🎉',
          body: `You completed ${result.courseId} quiz with ${result.score}%`
        }
      });
    }
    
    // Update user statistics
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        'statistics.totalQuizzes': admin.firestore.FieldValue.increment(1),
        'statistics.totalScore': admin.firestore.FieldValue.increment(result.score)
      });
  });
```

### Example 2: Update Course Statistics

```javascript
exports.updateCourseStats = functions.firestore
  .document('questions/{questionId}')
  .onWrite(async (change, context) => {
    const questionData = change.after.exists 
      ? change.after.data() 
      : change.before.data();
    const courseId = questionData.courseId;
    
    if (!courseId) return;
    
    // Count questions for each course
    const questionsSnapshot = await admin.firestore()
      .collection('questions')
      .where('courseId', '==', courseId)
      .get();
    
    const totalQuestions = questionsSnapshot.size;
    
    // Update course statistics
    await admin.firestore()
      .collection('courses')
      .doc(courseId)
      .update({
        totalQuestions: totalQuestions,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
  });
```

### Example 3: Process Summary Files

```javascript
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

exports.processSummaryFile = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;
    const bucket = object.bucket;
    
    // If PDF - extract information
    if (filePath.endsWith('.pdf')) {
      const fileSize = object.size;
      const contentType = object.contentType;
      
      // Save file info to Firestore
      await admin.firestore()
        .collection('summaries')
        .add({
          filePath: filePath,
          fileSize: fileSize,
          contentType: contentType,
          uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
          processed: true
        });
    }
    
    // If image - generate thumbnail
    if (filePath.match(/\.(jpg|jpeg|png)$/)) {
      // Use Cloud Vision API or ImageMagick
      // to generate thumbnail
    }
  });
```

### Example 4: Scheduled Tasks - Cleanup Old Data

```javascript
exports.cleanupOldData = functions.pubsub
  .schedule('every 7 days')
  .onRun(async (context) => {
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
    
    // Delete quiz results older than 7 months
    const oldResults = await admin.firestore()
      .collectionGroup('quizResults')
      .where('completedAt', '<', sevenMonthsAgo)
      .get();
    
    const batch = admin.firestore().batch();
    oldResults.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    console.log(`Deleted ${oldResults.size} old results`);
  });
```

### Example 5: Send Welcome Email

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

exports.sendWelcomeEmail = functions.auth
  .user()
  .onCreate(async (user) => {
    const mailOptions = {
      from: 'noreply@sahhel.com',
      to: user.email,
      subject: 'Welcome to Sahhel! 🎓',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Welcome ${user.displayName || 'User'}!</h1>
          <p>Thank you for joining Sahhel - The best learning platform</p>
          <p>Start learning now and explore:</p>
          <ul>
            <li>📚 Thousands of questions and quizzes</li>
            <li>📄 Comprehensive summaries</li>
            <li>🎯 Focus Hub for studying</li>
          </ul>
          <p>We wish you an enjoyable learning experience!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  });
```

### Example 6: Daily Performance Analysis

```javascript
exports.dailyAnalytics = functions.pubsub
  .schedule('every day 01:00')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Calculate statistics for yesterday
    const quizResults = await admin.firestore()
      .collectionGroup('quizResults')
      .where('completedAt', '>=', yesterday)
      .get();
    
    const stats = {
      totalQuizzes: quizResults.size,
      averageScore: 0,
      mostPopularCourse: null,
      date: yesterday
    };
    
    // Calculate average score
    let totalScore = 0;
    const courseCounts = {};
    
    quizResults.forEach(doc => {
      const data = doc.data();
      totalScore += data.score;
      
      if (courseCounts[data.courseId]) {
        courseCounts[data.courseId]++;
      } else {
        courseCounts[data.courseId] = 1;
      }
    });
    
    stats.averageScore = quizResults.size > 0 
      ? totalScore / quizResults.size 
      : 0;
    
    // Calculate most popular course
    let maxCount = 0;
    for (const [courseId, count] of Object.entries(courseCounts)) {
      if (count > maxCount) {
        maxCount = count;
        stats.mostPopularCourse = courseId;
      }
    }
    
    // Save statistics
    await admin.firestore()
      .collection('analytics')
      .add(stats);
    
    console.log('Daily statistics saved:', stats);
  });
```

### Example 7: Webhook Handler

```javascript
exports.handlePaymentWebhook = functions.https
  .onRequest(async (req, res) => {
    // Verify webhook signature
    const signature = req.headers['x-webhook-signature'];
    if (!verifySignature(signature, req.body)) {
      res.status(401).send('Unauthorized');
      return;
    }
    
    const paymentData = req.body;
    
    // Update subscription status
    if (paymentData.status === 'paid') {
      await admin.firestore()
        .collection('users')
        .doc(paymentData.userId)
        .update({
          subscription: {
            status: 'active',
            plan: paymentData.plan,
            expiresAt: paymentData.expiresAt
          }
        });
    }
    
    res.status(200).send('OK');
  });
```

### Example 8: Automatic Backup

```javascript
exports.dailyBackup = functions.pubsub
  .schedule('every day 02:00')
  .onRun(async (context) => {
    const timestamp = new Date().toISOString();
    
    // Backup Firestore to Cloud Storage
    const firestoreBackup = await admin.firestore()
      .collection('backups')
      .add({
        type: 'firestore',
        timestamp: timestamp,
        status: 'completed'
      });
    
    // Backup Storage files
    const storageBackup = await admin.firestore()
      .collection('backups')
      .add({
        type: 'storage',
        timestamp: timestamp,
        status: 'completed'
      });
    
    console.log('Daily backup completed:', timestamp);
  });
```

---

## 🚀 Setup Instructions (For Later)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Functions
```bash
firebase init functions
```

### 4. Write Your Code
- Write Functions in `functions/index.js`
- Use `firebase deploy --only functions` to deploy

### 5. Set Configuration (if needed)
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-password"
```

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0",
    "nodemailer": "^6.9.0",
    "@google-cloud/storage": "^6.0.0"
  }
}
```

---

## 💰 Pricing

Firebase Functions pricing:
- **Free Tier:** 2 million invocations/month
- **Paid:** $0.40 per million invocations after free tier
- **Compute Time:** $0.0000025 per GB-second

**Note:** For most projects, the free tier is sufficient.

---

## 🔒 Security Best Practices

1. **Validate Input Data**
```javascript
if (!data.email || !data.name) {
  throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
}
```

2. **Use Environment Variables**
```javascript
const apiKey = functions.config().api.key;
```

3. **Implement Rate Limiting**
```javascript
// Use Firebase App Check or custom rate limiting
```

4. **Secure Webhooks**
```javascript
// Always verify webhook signatures
```

---

## 📚 Additional Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Functions Examples](https://github.com/firebase/functions-samples)
- [Firebase Functions Pricing](https://firebase.google.com/pricing)
- [Firebase Functions Best Practices](https://firebase.google.com/docs/functions/best-practices)

---

## ✅ Summary

- **Now:** Project works without Functions ✅
- **Later:** Can add Functions for advanced features 🔄
- **Priority:** Focus on core features first 🎯

---

## 🎯 Recommended Implementation Order

1. **Phase 1 (Current):** Core features without Functions
2. **Phase 2 (Later):** Add notification functions
3. **Phase 3 (Later):** Add analytics and statistics
4. **Phase 4 (Later):** Add scheduled tasks and backups

---

**Last Updated:** 2025-01-15
