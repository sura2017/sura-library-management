const axios = require('axios');

const sendEmail = async (to, subject, text) => {
    try {
        const data = {
            sender: { 
                name: "Sura Library", 
                email: "abrhamsura85@gmail.com" // 👈 Must be the email you used to sign up for Brevo
            },
            to: [{ email: to }],
            subject: subject,
            textContent: text
        };

        const config = {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, // We will set this in Render
                'content-type': 'application/json'
            }
        };

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, config);
        console.log("📧 Real Email Sent to:", to, "| ID:", response.data.messageId);

    } catch (error) {
        console.error("❌ Brevo API Error:", error.response ? error.response.data : error.message);
    }
};

module.exports = sendEmail;