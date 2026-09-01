require("dotenv").config;
const nodemailer = require("nodemailer");

//Create transporter to send email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create function send email
const sendEmailVerification = async (
  username,
  userEmail,
  verfificationLink
) => {
  let message = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Account verification",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="" alt="InkMe Logo" style="width: 150px; height: auto;" />
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2988BC; text-align: center;">Account verificationt</h2>
            <p style="color: #333; font-size: 16px; text-align: center;">
              Xin chào <strong>${username}</strong>,
            </p>
            <p style="color: #333; font-size: 16px; text-align: center;">Thank you for registering an account at InkMe Shop. To complete the registration process, please click the button below to verify your email address.          </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verfificationLink}" style="background-color: #2988BC; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Xác minh ngay</a>
            </div>
            <p style="color: #333; font-size: 14px; text-align: center;">If you did not register, please ignore this email. qua email này.
            </p>
          </div>
          <div style="text-align: center; padding-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2025 InkMe. All rights reserved.ght can/be Protect Save.</p>
          </div>
        </div>
      `,
  };

  try {
    await transporter.sendMail(message);
    console.log("Verification mail send success to ", userEmail);
  } catch (error) {
    throw new Error(`Send verification mail failed: ${error.message}`);
  }
};

//Send mail reset password
const sendEmailResetPassword = async (userEmail, resetLink) => {
  let message = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Forgot password",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding-bottom: 20px;">
              <img src="" alt="InkMe Logo" style="width: 150px; height: auto;" />
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <h2 style="color: #2988BC; text-align: center;">Reset password Password</h2>
              <p style="color: #333; font-size: 16px; text-align: center;">Hello</strong>,
              </p>
              <p style="color: #333; font-size: 16px; text-align: center;">This is a confirmation email to change your password. To complete the process, please click the button below to go to the new password change page for your account.       </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #2988BC; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Change new password</a>
              </div>
              <p style="color: #333; font-size: 14px; text-align: center;">If you did not make a password change, please ignore this email.            </p>
            </div>
            <div style="text-align: center; padding-top: 20px; color: #999; font-size: 12px;">
              <p>&copy; 2025 InkMe. All rights reserved.Save.</p>
            </div>
          </div>
        `,
  };

  try {
    await transporter.sendMail(message);
    console.log("Send reset-password mail send success to ", userEmail);
  } catch (error) {
    throw new Error(`Send reset-password mail failed: ${error.message}`);
  }
};

module.exports = { sendEmailVerification, sendEmailResetPassword };
