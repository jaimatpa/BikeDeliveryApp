/* This module exports various functions for creating & sending email messages */

const nodemailer = require("nodemailer");

let appName = process.env.APP_NAME || 'Paradym'
let appEmail = process.env.APP_EMAIL || 'zchowdhury@paradynamix.com'
let primaryColor = process.env.COLOR_PRIMARY || '#0E4D80'

// Sends an email message using nodemailer
async function sendEmail(message) {
  console.log('Sending an email message...')
  if (!message.hasOwnProperty('from')) {
    message.from = `"${appName}" <${appEmail}>`
  }
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465 ? true : false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
    let result = await transporter.sendMail(message)
    console.log('Email sent.')
    return { success: true, messageId: result.messageId }
  } catch (err) {
    console.log('Error sending email: ' + err)
    return { error: true, message: err }
  }
}

// Creates an email-friendly HTML button
function createButton(text, link) {
  let button = `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate; line-height:100%; margin: 0 auto;">
      <tr>
        <td align="center" bgcolor="{${primaryColor}}" role="presentation" style="border:none; border-radius: 4px; cursor:auto; padding: 8px 16px; background:${primaryColor}; width: 200px;" valign="middle">
        <a href="${link}" style="background:${primaryColor}; color:#ffffff; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 500; line-height: 44px; text-transform: uppercase; margin: 24px auto 0 auto; text-decoration:none; text-align: center;" target="_blank">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
  return button
}

// Creates an email message that includes a title, message, and a button link
function createMessage(messageInfo) {
  let msg = '<div style="background-color: #ffffff">'
  msg += '<div style="max-width: 600px; margin: 0 auto; font-family: \'Roboto\', sans-serif; font-weight: 400; text-align: center;">'
  msg += '<h1 style="font-weight: 400;">' + messageInfo.title + '</h1>'
  msg += '<p>' + messageInfo.message + '</p>'
  msg += createButton(messageInfo.linkText, messageInfo.link)
  msg += '</div>'
  msg += '</div>'
  return msg
}

// Creates a 'Password Was Reset' message
function createPasswordWasResetMessage(email) {
  return createMessage({
    title: `<span style="color: ${primaryColor};">${appName}</span> account update!`,
    message: `Your ${appName} password was reset.`,
    link: process.env.CLIENT_URL + '/login',
    linkText: 'Login'
  })
}

// Creates a 'Verify Your Email' message
function createVerifyEmailMessage(token, email) {
  return createMessage({
    title: `Welcome to <span style="color: ${primaryColor};">${appName}</span>!`,
    message: 'Click the button below to verify your email address.',
    link: process.env.CLIENT_URL + '/verifyEmail?token=' + token + '&email=' + email,
    linkText: 'Verify My Email'
  })
}

// Creates a 'Reset Your Password' message
function createResetPasswordMessage(token, email) {
  return createMessage({
    title: 'Reset Password',
    message: `Click the button below to reset your ${appName} password.`,
    link: process.env.CLIENT_URL + '/resetPassword?token=' + token + '&email=' + email,
    linkText: 'Reset My Password'
  })
}

module.exports = {
  sendEmail,
  createButton,
  createMessage,
  createPasswordWasResetMessage,
  createVerifyEmailMessage,
  createResetPasswordMessage
}
