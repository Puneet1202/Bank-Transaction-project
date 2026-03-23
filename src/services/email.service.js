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
import * as Brevo from '@getbrevo/brevo';

// Brevo Setup (Production ke liye)
const apiInstance = new Brevo.TransactionalEmailsApi();
if (process.env.NODE_ENV === 'production') {
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

// Mailtrap Setup (Local ke liye)
const mailtrapTransporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

/**
 * Modern HTML Wrapper - Sabhi emails ka base design
 */
const emailWrapper = (content) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: #4F46E5; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">💰 Bank App</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            ${content}
        </div>
        <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            © 2026 Bank App. Secure Transactions.
        </div>
    </div>
`;

export const sendEmail = async (to, subject, html) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            // PRODUCTION: Brevo API use karein
            const sendSmtpEmail = new Brevo.SendSmtpEmail();
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = html;
            sendSmtpEmail.sender = { "name": "Bank App", "email": "punitkumar2121999@gmail.com" };
            sendSmtpEmail.to = [{ "email": to }];

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('✅ Email sent via Brevo API');
        } else {
            // LOCAL: Mailtrap
            await mailtrapTransporter.sendMail({
                from: '"Bank App" <test@example.com>',
                to,
                subject,
                html,
            });
            console.log('🧪 Email sent via Mailtrap');
        }
    } catch (error) {
        console.error('❌ Email Error:', error.message);
    }
};

// --- Beautifully Designed Helper Functions ---

export const sendWelcomeEmail = (user, password) => {
    const html = emailWrapper(`
        <h2 style="color: #4F46E5;">Welcome, ${user.username}!</h2>
        <p>Your account has been created successfully. Login with the credentials below:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Email:</b> ${user.email}</p>
            <p style="margin: 5px 0;"><b>Password:</b> ${password}</p>
        </div>
        <p>Please change your password after logging in for security.</p>
    `);
    sendEmail(user.email, "Welcome to Bank App", html);
};

export const sendLoginEmail = (user) => {
    const html = emailWrapper(`
        <h2 style="color: #10B981;">New Login Detected</h2>
        <p>Hello ${user.username},</p>
        <p>Your account was just logged in from a new session. If this wasn't you, please secure your account.</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
    `);
    sendEmail(user.email, "Login Alert - Bank App", html);
};

export const sendTransactionEmail = (userEmail, name, amount, type) => {
    const color = type.toLowerCase() === 'credit' ? '#10B981' : '#EF4444';
    const html = emailWrapper(`
        <h2 style="color: ${color};">Transaction Alert</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your account has been <b>${type}ed</b> with an amount of:</p>
        <h1 style="color: ${color}; margin: 10px 0;">₹${amount}</h1>
        <p>Check your dashboard for updated balance.</p>
    `);
    sendEmail(userEmail, "Bank Transaction Alert", html);
};

export const sendFailedTransactionEmail = (userEmail, name, amount, type) => {
    const html = emailWrapper(`
        <h2 style="color: #EF4444;">Transaction Failed</h2>
        <p>Hi ${name},</p>
        <p>The attempted transaction of <b>₹${amount}</b> was failed due to technical issues.</p>
        <p>Don't worry, no money was deducted from your account.</p>
    `);
    sendEmail(userEmail, "Alert: Transaction Failed", html);
};