const nodemailer = require("nodemailer");

module.exports.sendEmail = async function sendEmail(message) {
  console.log('Sending an email message...')
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