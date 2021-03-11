const express = require('express')
const router = express.Router()
const models = require('./../../models')
const jwt = require('jsonwebtoken')

// ****************
// Login User route
// ****************
router.post('/', async (req, res) => {
  console.log('Login: Attempt to login user ' + (req.body.email ? req.body.email : '[email not provided]'))
  // Check if email and password seem valid
  if (!req.body.email || !req.body.password) {
    console.log('Login: Missing credentials, returning error.')
    return res.send({ 'error': true, 'type': 'other', 'message': 'Invalid email or password.' })
  }
  try {
    console.log('Login: Locating user...')
    // Locate the user
    let userToLogin = await models.User.findOne({ where: { email: req.body.email, password: req.body.password } })
    console.log('Login: User found!')
    // If the user was found
    if (userToLogin) {
        console.log('Login: User authenticated.')
        // Create the payload & JWT token
        let payload = { id: userToLogin.id, email: userToLogin.email }
        let token
        try {
            console.log('Signing JWT Token...')
            token = jwt.sign(payload, process.env.JWT_SECRET)
            console.log('JWT Token signed!')
        } catch(e) {
            console.log('Error signing JWT token.')
            return res.send({ 'error': true, 'type': 'unknown', 'message': 'Server authentication error.' })
        }
        let response = {
        'success': true,
        'user': {
            id: userToLogin.id,
            email: userToLogin.email,
            name: userToLogin.name,
            displayName: userToLogin.displayName
        },
        'token': token,
        'message': 'User authenticated'
        }
        // Send the response
        console.log('Sending response...')
        return res.send(response)
    }
    else {
      console.log('Login: User not found. Returning error.')
      return res.send({ 'error': true, 'type': 'email', 'message': 'Couldn\'t find your account.' })
    }
  }
  catch(err) {
    console.log('Login: Unknown error. Returning error.')
    //  Handle other errors
    if (err.errors) {
      return res.send({ 'error': true, 'type': 'unknown', 'message': err.errors[0].message })
    } else { return res.send({ 'error': true, 'type': 'unknown', 'message': err }) }
  }
})

module.exports = router