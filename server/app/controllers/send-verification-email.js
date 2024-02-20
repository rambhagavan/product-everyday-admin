const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');p

// Endpoint to handle sending verification email
router.post('/send-verification-email', async (req, res) => {
  const { email, verificationToken } = req.body;

  // Construct the verification link
  const verificationLink = `http://127.0.0.1:6080/api/auth/verify-email/${verificationToken}`;

  // Construct the email content
  const emailContent = {
    to: email,
    from: 'sending-email@example.com', // Replace with your sender email
    subject: 'Verify Your Email',
    text: `Click the following link to verify your email: ${verificationLink}`,
    html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    // Send the email using SendGrid
    await sgMail.send(emailContent);

    // Respond to the client
    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router



// Go to the SendGrid website and sign up for an account.
// Create a new API Key from the SendGrid dashboard.

// Install SendGrid Node.js Library:

// Install the SendGrid Node.js library using npm:

// npm install @sendgrid/mail

// Use SendGrid in Your Backend:

// In your backend code, import the SendGrid library and configure it with your API key.  ( which i have mentioned above)


