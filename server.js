require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 1. MIDDLEWARE (Must come first)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FILES (Tell Express to look inside 'public' for CSS/JS/Images)
// This must come BEFORE your routes
app.use(express.static(path.join(__dirname, 'public')));

// 3. THE CONTACT ROUTE (The "Post Office")
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('Missing form data');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent from ${name}`);
        res.status(200).send('Success');
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.status(500).send('Failed to send email.');
    }
});

// 4. CATCH-ALL ROUTE (Must come LAST)
// This serves your index.html for any other request
app.get('/{*splat}', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log("📂 Serving file from:", indexPath);
    res.sendFile(indexPath);
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server active at http://localhost:${PORT}`);
});