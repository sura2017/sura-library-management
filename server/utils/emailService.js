const axios = require('axios'); // 🛡️ This requires the 'npm install axios' you just did

const sendEmail = async (to, subject, text) => {
    try {
        const data = {
            sender: { 
                name: "Sura Library", 
                email: "abrhamsura85@gmail.com" 
            },
            to: [{ email: to }],
            subject: subject,
            textContent: text
        };

        const config = {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, 
                'content-type': 'application/json'
            }
        };

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, config);
        console.log("📧 Success! Email sent to:", to);

    } catch (error) {
        // This will print the exact error if Brevo rejects the email
        console.error("❌ Brevo Error:", error.response ? error.response.data : error.message);
    }
};

module.exports = sendEmail;