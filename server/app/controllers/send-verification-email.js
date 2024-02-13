
// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;

// const UserOTPVerificationSchema=new Schema({
//   userId: String,
//   otp: String,
//   createdAt: Date,
//   expiresAt: Date,

// });

// const UserOTPVerification=mongoose.model(
//   "userOTPVerification",
//   UserOTPVerificationSchema

// )

// module.exports= UserOTPVerification;








// // Import necessary libraries
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// Endpoint to handle sending verification email
router.post('/send-verification-email', async (req, res) => {
  const { email, verificationToken } = req.body;

  // Construct the verification link
  const verificationLink = `http://yourapp.com/verify/${verificationToken}`;

  // Construct the email content
  const emailContent = {
    to: email,
    from: 'your-email@example.com', // Replace with your sender email
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

// Other routes...

module.exports = router;
