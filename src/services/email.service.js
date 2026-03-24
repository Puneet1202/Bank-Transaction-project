// email.service.js - No SDK needed!

export const transporter = {
    sendMail: async (options) => {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                subject: options.subject,
                htmlContent: options.html,
                sender: { name: "Bank App", email: "puneet.workdesk@gmail.com" },
                to: [{ email: options.to }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Email send failed');
        }

        return response.json();
    },
    verify: (callback) => callback(null)
};

transporter.verify((error) => {
    if (error) console.error('Email server error:', error);
    else console.log('Email server (API Mode) is ready');
});

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
        await transporter.sendMail({ to, subject, html });
        console.log('✅ Email sent successfully via Brevo API');
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
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