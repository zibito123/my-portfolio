const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Fixes the ENETUNREACH error
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FILES
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// 3. THE CONTACT ROUTE
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Check if fields are missing
    if (!name || !email || !message) {
        return res.status(400).send('Missing form data');
    }

    // Configure the Transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
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
}); // <--- This bracket closes the app.post function correctly

// 4. CATCH-ALL ROUTE
app.get(/(.*)/, (req, res) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).send('API route not found');
    }

    const rootIndex = path.join(__dirname, 'index.html');
    const publicIndex = path.join(__dirname, 'public', 'index.html');

    if (require('fs').existsSync(rootIndex)) {
        res.sendFile(rootIndex);
    } else if (require('fs').existsSync(publicIndex)) {
        res.sendFile(publicIndex);
    } else {
        res.status(404).send('index.html not found.');
    }
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server active at port ${PORT}`);
});