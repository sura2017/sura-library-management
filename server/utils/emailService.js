const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // 🆕 Use 587 instead of 465
    secure: false, // 🆕 Set to false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // 🆕 Helps bypass security blocks on cloud servers
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: `"Sura Library" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Email Error:", error.message);
        } else {
            console.log("📧 Email sent successfully to: " + to);
        }
    });
};

module.exports = sendEmail;