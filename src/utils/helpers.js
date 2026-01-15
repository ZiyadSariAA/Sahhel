// Helper Functions

/**
 * استدعاء Firebase HTTP Function لإرسال إيميل شكر
 */
export async function sendThankYouEmail(email, name = '') {
  try {
    // URL الـ function (بعد النشر)
    // يمكن تغييره بعد نشر Functions
    const functionUrl = import.meta.env.VITE_FUNCTIONS_URL || 
      'https://us-central1-sahhel-org.cloudfunctions.net/sendThankYouEmail';
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending thank you email:', error);
    return { success: false, error: error.message };
  }
}