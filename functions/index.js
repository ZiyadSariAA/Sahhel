/**
 * Firebase Cloud Functions for Sahhel
 * 
 * Functions تلقائية تشتغل على سيرفرات Google
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL CONFIGURATION (Using Environment Variables)
// ═══════════════════════════════════════════════════════════════════════════

// إعداد البريد الإلكتروني (يستخدم Environment Variables)
const getEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('⚠️ Email config not set. Set environment variables: EMAIL_USER and EMAIL_PASS');
    console.warn('   Use: firebase functions:secrets:set EMAIL_USER EMAIL_PASS');
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

// ═══════════════════════════════════════════════════════════════════════════
// 1. إرسال إيميل شكر (HTTP Function - يستدعى من الموقع)
// ═══════════════════════════════════════════════════════════════════════════

exports.sendThankYouEmail = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] })
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

    console.log(`📧 Sending thank you email to: ${email}`);

    const transporter = getEmailTransporter();
    if (!transporter) {
      console.log('⚠️ Email not sent - transporter not configured (demo mode)');
      // في وضع التجربة، نرجع نجاح بدون إرسال إيميل فعلي
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
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f8f6;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #7AA598;
              margin-bottom: 10px;
            }
            h1 {
              color: #1F2421;
              margin-bottom: 20px;
            }
            .content {
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e8f0ec;
              text-align: center;
              color: #8F9A96;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">سهّل</div>
              <h1>شكراً لك! 🙏</h1>
            </div>
            
            <div class="content">
              <p>${name ? `عزيزي/عزيزتي ${name},` : 'عزيزي المستخدم،'}</p>
              <p>نشكرك على استخدام <strong>سهّل</strong>!</p>
              <p>نتمنى أن تكون تجربتك معنا ممتعة ومفيدة.</p>
              <p>إذا كان لديك أي اقتراحات أو استفسارات، نحن هنا لمساعدتك.</p>
            </div>
            
            <div class="footer">
              <p>مع تحيات فريق سهّل</p>
              <p>نتمنى لك رحلة تعليمية ممتعة! 🎓</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Thank you email sent to ${email}`);
      response.status(200).json({ 
        success: true, 
        message: 'Email sent successfully' 
      });
    } catch (error) {
      console.error('❌ Error sending thank you email:', error);
      response.status(500).json({ 
        error: 'Failed to send email',
        message: error.message 
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. إنشاء مستند المستخدم في Firestore عند التسجيل
// ═══════════════════════════════════════════════════════════════════════════

exports.createUserDocument = functions
  .runWith({ secrets: ["EMAIL_USER", "EMAIL_PASS"] })
  .auth.user().onCreate(async (user) => {
  console.log(`📝 Creating user document for: ${user.uid}`);
  
  try {
    // إنشاء مستند المستخدم
    await admin.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        themePreference: 'system',
        statistics: {
          totalQuizzes: 0,
          totalScore: 0,
          totalSessions: 0,
          totalMinutes: 0
        },
        focusHub: {
          tasks: [],
          customizations: {
            selectedVibe: 'simple',
            background: 'default',
            timerSettings: {
              defaultDuration: 25,
              breakDuration: 5,
              autoStart: false
            }
          },
          statistics: {
            totalSessions: 0,
            totalMinutes: 0,
            lastSessionAt: null
          }
        }
      });
    
    console.log(`✅ User document created for ${user.uid}`);
    
    // إرسال إيميل ترحيبي
    const transporter = getEmailTransporter();
    if (transporter && user.email) {
      const displayName = user.displayName || 'المستخدم';
      
      const welcomeMailOptions = {
        from: 'سهّل Sahhel <nasabnihelp@gmail.com>',
        to: user.email,
        subject: 'مرحباً بك في سهّل! 🎉',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.8;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f8f6;
              }
              .container {
                background-color: #ffffff;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 42px;
                font-weight: bold;
                color: #7AA598;
                margin-bottom: 10px;
              }
              h1 {
                color: #1F2421;
                margin-bottom: 20px;
                font-size: 28px;
              }
              .welcome-icon {
                font-size: 60px;
                margin-bottom: 20px;
              }
              .content {
                margin: 20px 0;
                text-align: center;
              }
              .content p {
                margin: 15px 0;
                font-size: 16px;
              }
              .features {
                background-color: #f8faf9;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                text-align: right;
              }
              .features h3 {
                color: #7AA598;
                margin-bottom: 15px;
              }
              .features ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .features li {
                padding: 8px 0;
                border-bottom: 1px solid #e8f0ec;
              }
              .features li:last-child {
                border-bottom: none;
              }
              .features li::before {
                content: '✓ ';
                color: #7AA598;
                font-weight: bold;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #7AA598 0%, #5a8a7d 100%);
                color: white;
                padding: 15px 40px;
                border-radius: 30px;
                text-decoration: none;
                font-weight: bold;
                font-size: 18px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e8f0ec;
                text-align: center;
                color: #8F9A96;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="welcome-icon">🎉</div>
                <div class="logo">سهّل</div>
                <h1>مرحباً بك، ${displayName}!</h1>
              </div>
              
              <div class="content">
                <p>نحن سعداء جداً بانضمامك إلى <strong>سهّل</strong>!</p>
                <p>منصتك المثالية للتعلم والتركيز والإنتاجية.</p>
              </div>
              
              <div class="features">
                <h3>ماذا يمكنك فعله مع سهّل؟</h3>
                <ul>
                  <li>استعراض الدورات والمواد التعليمية</li>
                  <li>استخدام مركز التركيز مع مؤقت بومودورو</li>
                  <li>إدارة مهامك اليومية بكفاءة</li>
                  <li>اختبار نفسك وتتبع تقدمك</li>
                </ul>
              </div>
              
              <div class="content">
                <p>ابدأ رحلتك التعليمية الآن!</p>
              </div>
              
              <div class="footer">
                <p>مع تحيات فريق سهّل 💚</p>
                <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      try {
        await transporter.sendMail(welcomeMailOptions);
        console.log(`📧 Welcome email sent to ${user.email}`);
      } catch (emailError) {
        console.error('❌ Error sending welcome email:', emailError);
      }
    } else {
      console.log('⚠️ Welcome email not sent - transporter not configured or no email');
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    return null;
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. تحديث إحصائيات عند إكمال اختبار
// ═══════════════════════════════════════════════════════════════════════════

exports.onQuizCompleted = functions.firestore
  .document('users/{userId}/quizResults/{resultId}')
  .onCreate(async (snap, context) => {
    const result = snap.data();
    const userId = context.params.userId;
    
    console.log(`📊 Quiz completed by user ${userId}: Score ${result.score}%`);
    
    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        console.log(`⚠️ User ${userId} not found`);
        return null;
      }
      
      const currentStats = userDoc.data().statistics || {};
      
      await userRef.update({
        'statistics.totalQuizzes': admin.firestore.FieldValue.increment(1),
        'statistics.totalScore': admin.firestore.FieldValue.increment(result.score || 0),
        'statistics.lastQuizAt': admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Statistics updated for user ${userId}`);
      return null;
    } catch (error) {
      console.error('❌ Error updating quiz statistics:', error);
      return null;
    }
  });

// ═══════════════════════════════════════════════════════════════════════════
// 5. مهمة مجدولة - تنظيف البيانات القديمة (كل أسبوع)
// ═══════════════════════════════════════════════════════════════════════════

exports.cleanupOldData = functions.pubsub
  .schedule('0 0 * * 0')
  .timeZone('Asia/Riyadh')
  .onRun(async (_context) => {
    console.log('🧹 Starting cleanup of old data...');
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    try {
      // حذف نتائج الاختبارات الأقدم من 6 أشهر
      const oldResults = await admin.firestore()
        .collectionGroup('quizResults')
        .where('completedAt', '<', sixMonthsAgo)
        .limit(500)
        .get();
      
      if (oldResults.empty) {
        console.log('✅ No old data to clean up');
        return null;
      }
      
      const batch = admin.firestore().batch();
      oldResults.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      console.log(`✅ Cleaned up ${oldResults.size} old quiz results`);
      return null;
    } catch (error) {
      console.error('❌ Error cleaning up old data:', error);
      return null;
    }
  });

// ═══════════════════════════════════════════════════════════════════════════
// 6. HTTP Function للاختبار
// ═══════════════════════════════════════════════════════════════════════════

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.json({
    message: 'Hello from Sahhel Functions! 🚀',
    timestamp: new Date().toISOString(),
    project: 'sahhel-org'
  });
});

// Export all functions
module.exports = {
  sendThankYouEmail: exports.sendThankYouEmail,
  createUserDocument: exports.createUserDocument,
  onQuizCompleted: exports.onQuizCompleted,
  updateLastLogin: exports.updateLastLogin,
  cleanupOldData: exports.cleanupOldData,
  helloWorld: exports.helloWorld
};
