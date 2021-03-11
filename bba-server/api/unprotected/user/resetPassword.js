const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const email = require('./../../extensions/email')

// ********************
// Reset Password Route
// *******************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Reset Password: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Reset Password: New request received.')
  // Check if an email was provided
  if (!req.body.email)
    return err({ 'type': 'email', 'message': 'An email address is required.' })
  // Check if a token was provided
  if (!req.body.token)
    return err({ 'type': 'token', 'message': 'A reset token was not provided.' })
  // Check if passwords were provided & match
  if ((!req.body.password || !req.body.confirmPassword) || req.body.password !== req.body.confirmPassword)
    return err({ 'type': 'password', 'message': 'There was a problem with the new password.' })

  try {
    // Locate the user
    let user = await models.User.findOne({ where: { email: req.body.email } })
    if (!user)
      return err({ 'type': 'email', 'message': 'No account exists with this email address.' })
    else { // If a user was found
      // Get the stored token
      let storedToken = await models.ResetToken.findOne({ where: { userId: user.id, token: req.body.token }})
      if (!storedToken)
        return err({ 'type': 'token', 'message': 'The verification token provided was not found.' })
      else if (req.body.token == storedToken.token) { // Token successfully verified!
        // Delete the token
        await storedToken.destroy()
        // Update the user's password
        user.password = req.body.password
        user.save()

        // Send email notification
        console.log('Reset Password: Password Reset, sending email notification message...')
        let appName = process.env.APP_NAME ? process.env.APP_NAME : 'Paradym'
        let emailHTML = email.createPasswordWasResetMessage(user.email)
        let emailText = `Your ${appName} password was reset.`
        try {
          email.sendEmail({
            to: user.email, // list of receivers
            subject: `${appName}: Your password was reset.`, // Subject line
            text: emailText, // plain text body
            html: emailHTML, // html body
          })
        } catch(error) {
          console.log('Reset Password: Error sending password reset notification email')
        }

        // Send the response
        console.log('Reset Password: Reset Password completed.  Sending response.')
        return res.send({
          'success': true,
          'message': 'Password was successfully changed.'
        })
      } else // If token did not match
        return err({ 'type': 'token', 'message': 'The token was invalid.' })
    }
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
