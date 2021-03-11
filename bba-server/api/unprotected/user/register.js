const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const email = require('./../../extensions/email')
const crypto = require('crypto-random-string')

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// *****************
// Register User route
// *****************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Register: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Register: Attempt to create a new user...')
  // Check if email was provided
  if (!req.body.email)
    return err({ 'type': 'email', 'message': 'An email address is required.' })
  // Check if email is valid
  else if (!validateEmail(req.body.email))
    return err({ 'type': 'email', 'message': 'Invalid email address.' })
  // Check if password was provided
  if (!req.body.password)
    return err({ 'type': 'password', 'message': 'A password is required.' })

  try {
    // Locate the user
    let userToLogin = await models.User.findOne({ where: { email: req.body.email } })
    if (!userToLogin) { // If the user was NOT found
      try {
        // Create the user
        let newUser = await models.User.build({ email: req.body.email, firstName: req.body.firstName || '', lastName: req.body.lastName || '', password: req.body.password, isVerified: req.body.isVerified}).save()
        if (newUser) {
          console.log('Register: New User Created.')
          let response = {
            success: true,
            email: req.body.email,
            firstName: req.body.firstName || '',
            lastName: req.body.lastName || '',
            message: 'User created'
          }

          // Generate a verification token
          let token = await models.VerificationToken.build({
            userId: newUser.id,
            token: crypto({length: 16})
          }).save()

          // Send email verfication
          console.log('Register: Sending email verication message...')
          let emailHTML = email.createVerifyEmailMessage(token.token, newUser.email)
          let emailText = 'Visit ' + process.env.CLIENT_URL + 'verifyEmail?token=' + token.token + '&email=' + newUser.email + ' to verify your email address.'
          let appName = process.env.APP_NAME || 'Bullock Bike App'

          try {
            email.sendEmail({
              to: req.body.email, // list of receivers
              subject: `${appName}: Verify your Email address.`, // Subject line
              text: emailText, // plain text body
              html: emailHTML, // html body
            })
          } catch(error) {
            console.log(error)
            console.log('Register: Error sending verification email')
          }

          // Send the response
          console.log('Register: Registration completed. Sending Response.')
          return res.send(response)

        } else
          return err({'type': 'unknown', 'message': 'Error creating new user.' }, 500)

      } catch(error) {
        return err({'type': 'unknown', 'message': 'Error creating new user.' }, 500)
      }
    }
    else
      return err({'type': 'email', 'message': 'An account with this email already exists.' })
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
