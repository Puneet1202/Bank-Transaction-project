import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport(
    process.env.NODE_ENV === 'production'
    ? {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        }
    }
    : {
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    }
);


// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
export const sendEmail = async (to, subject, text, html) => {
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

export const sendWelcomeEmail = async(user, password) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Welcome to Bank App",
        html: `
            <h1>Welcome ${user.username}!</h1>
            <p>Your account has been created successfully.</p>
            <p><b>Email:</b> ${user.email}</p>
            <p><b>Password:</b> ${password}</p>
            <p>Please keep this safe!</p>
        `
    })
}


export const sendLoginEmail = async(user) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Login to Bank App",
        html: `
            <h1>Welcome ${user.username}!</h1>
            <p>Your account has been logged in successfully.</p>
            <p><b>Email:</b> ${user.email}</p>
        `
    })
}

//create account email with account number

export const sendCreateAccountEmail = async(user,accountNumber) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Create Account in Bank App",
        html: `
            <h1>Welcome ${user.username}!</h1>
            <p>Your account has been created successfully.</p>
            <p><b>Email:</b> ${user.email}</p>
            <p><b>Account Number:</b> ${accountNumber}</p>
            <p>Please keep this safe!</p>
        `
    })
}

export async function sendTransactionEmail(userEmail,name,amount,type){
  const subject = "Transaction Alert";
  const text = `Transaction Alert, ${name}, ${amount}, ${type}!`;
  const html = `<h1>Transaction Alert, ${name}, ${amount}, ${type}!</h1>`;
  await sendEmail(userEmail, subject, text, html);
}


export async function sendFailedTransactionEmail(userEmail,name,amount,type){
  const subject = "Transaction Failed";
  const text = `Transaction Failed, ${name}, ${amount}, ${type}!`;
  const html = `<h1>Transaction Failed, ${name}, ${amount}, ${type}!</h1>`;
  await sendEmail(userEmail, subject, text, html);
}





