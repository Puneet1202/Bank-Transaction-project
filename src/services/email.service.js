// import nodemailer from "nodemailer";
//  //mailtrap delelt only auth2
// export const transporter = nodemailer.createTransport(
//       if (process.env.NODE_ENV === 'production') {
//     return nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//       }
//     });
//   } else {
//     return nodemailer.createTransport({
//       host: process.env.MAILTRAP_HOST,
//       port: process.env.MAILTRAP_PORT,
//       auth: {
//         user: process.env.MAILTRAP_USER,
//         pass: process.env.MAILTRAP_PASS
//       }
//     });
//   }
    
// }
// }


// // Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Bank Transaction" <${process.env.EMAIL_USER}>`, // sender address
//       to, // list of receivers
//       subject, // Subject line
//       text, // plain text body
//       html, // html body
//     });

//     console.log('Message sent: %s', info.messageId);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// export const sendWelcomeEmail = async(user, password) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Welcome to Bank App",
//         html: `
//             <h1>Welcome ${user.username}!</h1>
//             <p>Your account has been created successfully.</p>
//             <p><b>Email:</b> ${user.email}</p>
//             <p><b>Password:</b> ${password}</p>
//             <p>Please keep this safe!</p>
//         `
//     })
// }


// export const sendLoginEmail = async(user) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Login to Bank App",
//         html: `
//             <h1>Welcome ${user.username}!</h1>
//             <p>Your account has been logged in successfully.</p>
//             <p><b>Email:</b> ${user.email}</p>
//         `
//     })
// }

// //create account email with account number

// export const sendCreateAccountEmail = async(user,accountNumber) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Create Account in Bank App",
//         html: `
//             <h1>Welcome ${user.username}!</h1>
//             <p>Your account has been created successfully.</p>
//             <p><b>Email:</b> ${user.email}</p>
//             <p><b>Account Number:</b> ${accountNumber}</p>
//             <p>Please keep this safe!</p>
//         `
//     })
// }

// export async function sendTransactionEmail(userEmail,name,amount,type){
//   const subject = "Transaction Alert";
//   const text = `Transaction Alert, ${name}, ${amount}, ${type}!`;
//   const html = `<h1>Transaction Alert, ${name}, ${amount}, ${type}!</h1>`;
//   await sendEmail(userEmail, subject, text, html);
// }


// export async function sendFailedTransactionEmail(userEmail,name,amount,type){
//   const subject = "Transaction Failed";
//   const text = `Transaction Failed, ${name}, ${amount}, ${type}!`;
//   const html = `<h1>Transaction Failed, ${name}, ${amount}, ${type}!</h1>`;
//   await sendEmail(userEmail, subject, text, html);
// }


import nodemailer from "nodemailer";

const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // RENDER FIX: Gmail block hota hai, isliye Brevo SMTP use kar rahe hain
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
       user: 'a5cabd001@smtp-brevo.com',
        pass: process.env.BREVO_SMTP_KEY
      }
    });
  } else {
    // LOCAL: Mailtrap (Pehle jaisa)
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }
};

export const transporter = createTransporter();

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('Email server connection failed:', error.message);
  } else {
    console.log('Email server is ready');
  }
});

/**
 * Base Template Design
 */
const emailHTML = (title, content) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Bank App</h1>
    </div>
    <div style="padding: 20px; color: #333; line-height: 1.5;">
      <h2 style="color: #4F46E5;">${title}</h2>
      ${content}
    </div>
    <div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777;">
      © 2026 Bank App Project. Secure & Fast.
    </div>
  </div>
`;

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Transaction" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

export const sendWelcomeEmail = async (user, password) => {
  const content = `
    <p>Hi <b>${user.username}</b>,</p>
    <p>Your account has been created successfully. Below are your login details:</p>
    <p><b>Email:</b> ${user.email}<br><b>Password:</b> ${password}</p>
    <p>Please change your password after your first login.</p>
  `;
  await sendEmail(user.email, "Welcome to Bank App", "Welcome!", emailHTML("Account Created", content));
};

export const sendLoginEmail = async (user) => {
  const content = `
    <p>Hi <b>${user.username}</b>,</p>
    <p>A new login was detected on your account.</p>
    <p><b>Time:</b> ${new Date().toLocaleString()}</p>
    <p>If this wasn't you, please reset your password immediately.</p>
  `;
  await sendEmail(user.email, "Login Alert - Bank App", "New Login", emailHTML("Security Alert", content));
};

export const sendCreateAccountEmail = async (user, accountNumber) => {
  const content = `
    <p>Congratulations <b>${user.username}</b>!</p>
    <p>Your new bank account has been successfully generated.</p>
    <p style="font-size: 18px; font-weight: bold;">Account Number: ${accountNumber}</p>
  `;
  await sendEmail(user.email, "Bank Account Activated", "Account Created", emailHTML("Success", content));
};

export const sendTransactionEmail = async (userEmail, name, amount, type) => {
  const color = type.toLowerCase() === 'credit' ? 'green' : 'red';
  const content = `
    <p>Hello ${name},</p>
    <p>A transaction has occurred in your account:</p>
    <h2 style="color: ${color};">${type.toUpperCase()}: ₹${amount}</h2>
    <p>Your balance has been updated accordingly.</p>
  `;
  await sendEmail(userEmail, "Transaction Alert", "Transaction Update", emailHTML("Transaction Alert", content));
};

export const sendFailedTransactionEmail = async (userEmail, name, amount, type) => {
  const content = `
    <p>Hi ${name},</p>
    <p>The transaction of <b>₹${amount}</b> for <b>${type}</b> has failed.</p>
    <p>Reason: Technical issue. No funds were deducted.</p>
  `;
  await sendEmail(userEmail, "Transaction Failed", "Failed Alert", emailHTML("Transaction Failed", content));
};