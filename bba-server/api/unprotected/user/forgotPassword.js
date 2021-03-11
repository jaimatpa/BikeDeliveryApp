const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const email = require('./../../extensions/email')
const cryptoRandomString = require('crypto-random-string')

// *********************
// Forgot Password Route
// *********************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Signup: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Forgot Password: New request received.')
  // Check if an email was provided
  if (!req.body.email)
    return err({ 'type': 'email', 'message': 'An email address is required.' })

  try {
    // Locate the user
    let user = await models.User.findOne({ where: { email: req.body.email } })
    console.log(user);
    if (!user)
      return err({ 'type': 'email', 'message': 'No account exists with this email address.' })
    else { // If we found the user
      if (user.isVerified) { // If user has been verified
        // Locate and delete any preexisting token
        let existingToken = await models.ResetToken.findOne({ where: { userId: user.id }})
        if (existingToken)
          await existingToken.destroy()
        // Create a new token
        let token = await models.ResetToken.build({
          userId: user.id,
          token: cryptoRandomString({length: 64, type: 'url-safe'})
        }).save()

        // Send password reset email
        console.log('Forgot Password: Sending password reset email message...')
        let emailHTML = email.createResetPasswordMessage(token.token, user.email)
        let emailText = 'Visit ' + process.env.CLIENT_URL + '/resetPassword?token=' + token.token + '&email=' + user.email + ' to reset your password.'
        let appName = process.env.APP_NAME ? process.env.APP_NAME : 'Paradym'
        try {
          email.sendEmail({
            to: req.body.email, // list of receivers
            subject: appName + ": Reset your Password", // Subject line
            text: emailText, // plain text body
            html: emailHTML, // html body
          })
        } catch(error) {
          console.log('Forgot Password: Error sending verification email')
        }

        // Send the response
        console.log('Forgot Password: Email sent, sending response.')
        let response = {
          'success': true,
          'email': req.body.email,
          'message': 'Password reset email was sent.'
        }
        return res.send(response)
      } else // User was not verified
        return err({ 'type': 'verification', 'message': 'User not verified.' }, 401)

    } //asdf
  }
  catch(error) {
    //  Handle other errors
    if (error.errors)
      return err({ 'type': 'unknown', 'message': error.errors[0].message }, 500)
    else
      return err({ 'type': 'unknown', 'message': error }, 500)
  }
})

module.exports = router
