import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Transaction" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendWelcomeEmail(user){
  const subject = "Welcome to Bank Transaction";
  const text = `Welcome to Bank Transaction, ${user.username}!`;
  const html = `<h1>Welcome to Bank Transaction, ${user.username}!</h1>`;
  await sendEmail(user.email, subject, text, html);
}

async function sendTransactionEmail(userEmail,name,amount,type){
  const subject = "Transaction Alert";
  const text = `Transaction Alert, ${name}, ${amount}, ${type}!`;
  const html = `<h1>Transaction Alert, ${name}, ${amount}, ${type}!</h1>`;
  await sendEmail(userEmail, subject, text, html);
}


export {sendEmail,transporter,sendWelcomeEmail,sendTransactionEmail};