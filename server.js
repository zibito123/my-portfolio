require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FILES (Serving from the root folder)
app.use(express.static(path.join(__dirname)));

// 3. THE CONTACT ROUTE
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('Missing form data');
    }

    // UPDATED TRANSPORTER: Better for Render/Cloud environments
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL for port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Adding a timeout setting to prevent long hanging requests
        connectionTimeout: 10000
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Gmail requires 'from' to be the authenticated user
        to: process.env.EMAIL_USER,
        replyTo: email, // This allows you to click 'Reply' to the sender's email
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${name}`);
        res.status(200).send('Success');
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.status(500).send('Failed to send email.');
    }
});

// 4. CATCH-ALL ROUTE (Serves index.html for any refresh/random URL)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server active at http://localhost:${PORT}`);
});