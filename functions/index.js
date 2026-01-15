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
      from: 'سهّل | Sahhel <nasabnihelp@gmail.com>',
      to: email,
      subject: 'شكراً لك! 🙏',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.8;
              color: #1F2421;
              background: linear-gradient(135deg, #F4F8F6 0%, #E8F0EC 100%);
              padding: 20px;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 8px 24px rgba(31, 36, 33, 0.08);
            }
            .header {
              background: linear-gradient(135deg, #7AA598 0%, #5a8a7d 100%);
              padding: 40px 30px;
              text-align: center;
              color: #ffffff;
            }
            .logo {
              font-size: 42px;
              font-weight: bold;
              margin-bottom: 15px;
              letter-spacing: 2px;
            }
            .logo-subtitle {
              font-size: 16px;
              opacity: 0.95;
              font-weight: 300;
            }
            .content-wrapper {
              padding: 40px 30px;
            }
            .icon-wrapper {
              text-align: center;
              margin-bottom: 25px;
            }
            .icon-emoji {
              font-size: 64px;
              display: inline-block;
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            h1 {
              color: #1F2421;
              font-size: 28px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 600;
            }
            .content {
              margin: 25px 0;
              text-align: center;
            }
            .content p {
              margin: 15px 0;
              font-size: 16px;
              color: #5A6662;
              line-height: 1.8;
            }
            .content strong {
              color: #7AA598;
              font-weight: 600;
            }
            .highlight-box {
              background: linear-gradient(135deg, #F4F8F6 0%, #E8F0EC 100%);
              border-right: 4px solid #7AA598;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
              text-align: right;
            }
            .highlight-box p {
              color: #1F2421;
              font-size: 16px;
              margin: 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #7AA598 0%, #5a8a7d 100%);
              color: #ffffff !important;
              padding: 16px 40px;
              border-radius: 30px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              margin: 25px 0;
              box-shadow: 0 4px 12px rgba(122, 165, 152, 0.3);
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(122, 165, 152, 0.4);
            }
            .footer {
              background-color: #F4F8F6;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #DCE7E2;
            }
            .footer p {
              color: #8F9A96;
              font-size: 14px;
              margin: 8px 0;
            }
            .footer-brand {
              color: #7AA598;
              font-weight: 600;
              font-size: 16px;
            }
            @media only screen and (max-width: 600px) {
              .header {
                padding: 30px 20px;
              }
              .content-wrapper {
                padding: 30px 20px;
              }
              .logo {
                font-size: 36px;
              }
              h1 {
                font-size: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">سهّل | Sahhel</div>
                <div class="logo-subtitle">منصة التعلم الذكية</div>
              </div>
              
              <div class="content-wrapper">
                <div class="icon-wrapper">
                  <div class="icon-emoji">🙏</div>
                </div>
                
                <h1>شكراً لك!</h1>
                
                <div class="content">
                  <p>${name ? `عزيزي/عزيزتي <strong>${name}</strong>,` : 'عزيزي المستخدم،'}</p>
                  <p>نشكرك على استخدام <strong>سهّل</strong>!</p>
                  <p>نتمنى أن تكون تجربتك معنا ممتعة ومفيدة.</p>
                </div>
                
                <div class="highlight-box">
                  <p>💡 إذا كان لديك أي اقتراحات أو استفسارات، نحن هنا لمساعدتك دائماً.</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="https://sahhel-org.web.app" class="cta-button" style="color: #ffffff;">زيارة الموقع</a>
                </div>
              </div>
              
              <div class="footer">
                <p class="footer-brand">سهّل | Sahhel</p>
                <p>نتمنى لك رحلة تعليمية ممتعة! 🎓</p>
                <p style="margin-top: 15px; font-size: 12px; color: #8F9A96;">© 2026 سهّل. جميع الحقوق محفوظة.</p>
              </div>
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
        from: 'سهّل | Sahhel <nasabnihelp@gmail.com>',
        to: user.email,
        subject: 'مرحباً بك في سهّل! 🎉',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.8;
                color: #1F2421;
                background: linear-gradient(135deg, #F4F8F6 0%, #E8F0EC 100%);
                padding: 20px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
              }
              .container {
                background-color: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(31, 36, 33, 0.08);
              }
              .header {
                background: linear-gradient(135deg, #7AA598 0%, #5a8a7d 100%);
                padding: 50px 30px;
                text-align: center;
                color: #ffffff;
                position: relative;
              }
              .header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
              }
              .logo {
                font-size: 42px;
                font-weight: bold;
                margin-bottom: 15px;
                letter-spacing: 2px;
              }
              .logo-subtitle {
                font-size: 16px;
                opacity: 0.95;
                font-weight: 300;
              }
              .welcome-icon {
                font-size: 80px;
                margin-bottom: 20px;
                display: inline-block;
                animation: bounce 2s infinite;
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-15px) scale(1.1); }
              }
              .content-wrapper {
                padding: 40px 30px;
              }
              h1 {
                color: #1F2421;
                font-size: 32px;
                margin-bottom: 25px;
                text-align: center;
                font-weight: 600;
              }
              .content {
                margin: 25px 0;
                text-align: center;
              }
              .content p {
                margin: 15px 0;
                font-size: 18px;
                color: #5A6662;
                line-height: 1.8;
              }
              .content strong {
                color: #7AA598;
                font-weight: 600;
              }
              .features {
                background: linear-gradient(135deg, #F4F8F6 0%, #E8F0EC 100%);
                border-right: 4px solid #7AA598;
                border-radius: 16px;
                padding: 30px;
                margin: 35px 0;
                text-align: right;
              }
              .features h3 {
                color: #1F2421;
                font-size: 22px;
                margin-bottom: 20px;
                font-weight: 600;
                text-align: right;
              }
              .features ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .features li {
                padding: 12px 0;
                border-bottom: 1px solid #DCE7E2;
                font-size: 16px;
                color: #5A6662;
                transition: all 0.3s ease;
              }
              .features li:last-child {
                border-bottom: none;
              }
              .features li::before {
                content: '✓ ';
                color: #7AA598;
                font-weight: bold;
                font-size: 18px;
                margin-left: 10px;
              }
              .features li:hover {
                color: #1F2421;
                padding-right: 10px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #7AA598 0%, #5a8a7d 100%);
                color: #ffffff !important;
                padding: 18px 45px;
                border-radius: 30px;
                text-decoration: none;
                font-weight: 600;
                font-size: 18px;
                margin: 30px 0;
                box-shadow: 0 4px 12px rgba(122, 165, 152, 0.3);
                transition: all 0.3s ease;
              }
              .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(122, 165, 152, 0.4);
              }
              .footer {
                background-color: #F4F8F6;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #DCE7E2;
              }
              .footer p {
                color: #8F9A96;
                font-size: 14px;
                margin: 8px 0;
              }
              .footer-brand {
                color: #7AA598;
                font-weight: 600;
                font-size: 16px;
              }
              @media only screen and (max-width: 600px) {
                .header {
                  padding: 40px 20px;
                }
                .content-wrapper {
                  padding: 30px 20px;
                }
                .logo {
                  font-size: 36px;
                }
                h1 {
                  font-size: 26px;
                }
                .welcome-icon {
                  font-size: 60px;
                }
                .features {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <div class="header">
                  <div class="welcome-icon">🎉</div>
                  <div class="logo">سهّل | Sahhel</div>
                  <div class="logo-subtitle">منصة التعلم الذكية</div>
                </div>
                
                <div class="content-wrapper">
                  <h1>مرحباً بك، ${displayName}!</h1>
                  
                  <div class="content">
                    <p>نحن <strong>سعداء جداً</strong> بانضمامك إلى <strong>سهّل</strong>!</p>
                    <p>منصتك المثالية للتعلم والتركيز والإنتاجية.</p>
                  </div>
                  
                  <div class="features">
                    <h3>✨ ماذا يمكنك فعله مع سهّل؟</h3>
                    <ul>
                      <li>استعراض الدورات والمواد التعليمية</li>
                      <li>استخدام مركز التركيز مع مؤقت بومودورو</li>
                      <li>إدارة مهامك اليومية بكفاءة</li>
                      <li>اختبار نفسك وتتبع تقدمك</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="https://sahhel-org.web.app" class="cta-button" style="color: #ffffff;">ابدأ رحلتك التعليمية الآن</a>
                  </div>
                </div>
                
                <div class="footer">
                  <p class="footer-brand">سهّل | Sahhel</p>
                  <p>💚 مع تحيات فريق سهّل</p>
                  <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
                  <p style="margin-top: 15px; font-size: 12px; color: #8F9A96;">© 2026 سهّل. جميع الحقوق محفوظة.</p>
                </div>
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
