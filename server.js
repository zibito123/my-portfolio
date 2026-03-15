require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/// 2. STATIC FILES
// This tells Express to look for files in the root AND in a 'public' folder
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));
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

// 4. CATCH-ALL ROUTE
// Using '/*' instead of '*' to satisfy the new Path-to-RegExp requirements
app.get('/*', (req, res) => {
    const rootIndex = path.join(__dirname, 'index.html');
    const publicIndex = path.join(__dirname, 'public', 'index.html');

    if (require('fs').existsSync(rootIndex)) {
        res.sendFile(rootIndex);
    } else if (require('fs').existsSync(publicIndex)) {
        res.sendFile(publicIndex);
    } else {
        res.status(404).send('index.html not found');
    }
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server active at port ${PORT}`);
});