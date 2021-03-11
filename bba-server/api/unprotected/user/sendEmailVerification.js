const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const email = require('./../../extensions/email')
const cryptoRandomString = require('crypto-random-string')

// *************************
// Create Verify Token route
// *************************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Send Verify Token: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Send Verify Token: Attempt to create a new verify token for ' + (req.body.email ? req.body.email : '[email not provided]'))
  // Check if email was provided
  if (!req.body.email)
    return err({ 'type': 'email', 'message': 'An email address is required.' })

  try {
    // Locate the user
    let user = await models.User.findOne({ where: { email: req.body.email } })
    if (user) { // If the user was found
      // Check if this user was already verified
      if (user.isVerified)
        return err({ 'type': 'other', 'message': 'This account has already been verified.' })
      else { // If the user has not yet verified
        // Locate and delete any preexisting tokens
        let existingToken = await models.VerificationToken.findOne({ where: { userId: user.id }})
        if (existingToken)
          await existingToken.destroy()
        // Create a new token
        let token = await models.VerificationToken.build({
          userId: user.id,
          token: cryptoRandomString({length: 32, type: 'url-safe'})
        }).save()

        // Send email verfication
        console.log('Send Verify Token: Token created, sending email verification message...')
        let appName = process.env.APP_NAME ? process.env.APP_NAME : 'Paradym'
        let emailHTML = email.createVerifyEmailMessage(token.token, user.email)
        let emailText = 'Visit ' + process.env.CLIENT_URL + '/verifyEmail?token=' + token.token + '&email=' + user.email + ' to verify your email address.'
        email.sendEmail({
          to: req.body.email, // list of receivers
          subject: `${appName}: Verify your Email address.`, // Subject line
          text: emailText, // plain text body
          html: emailHTML, // html body
        })
        // Send the response
        console.log('Send Verify Token: Token sent. Sending response.')
        let response = {
          'success': true,
          'email': req.body.email,
          'message': 'A new email verification message was sent.'
        }
        return res.send(response)
      }
    }
    else
      return err({ 'type': 'email', 'message': 'An account with this email address does not exist.' })
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
