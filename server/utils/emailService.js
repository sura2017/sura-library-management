const { Resend } = require('resend');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        const data = await resend.emails.send({
            from: 'Library <onboarding@resend.dev>', // 👈 Free testing email
            to: [to], // 👈 This will send to your email
            subject: subject,
            text: text,
        });

        console.log("📧 Email sent successfully via Resend API:", data.id);
    } catch (error) {
        console.error("❌ Resend API Error:", error.message);
    }
};

module.exports = sendEmail;