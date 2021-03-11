const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const verifyAuthHeader = require('./../../extensions/verifyAuthHeader')

// *****************
// Update User Route
// *****************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Update User: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Update User: New request received.')

  // Authenticate request & decode token
  let decodedToken = verifyAuthHeader(req.headers.authorization)
  if (!decodedToken || !decodedToken.id)
    return err({ 'type': 'authentication', 'message': 'Unauthorized request.' }, 401)

  // Check if we have new user data to update
  //if (!req.body.name || !req.body.name.length)
  //  return err({ 'type': 'other', 'message': 'No user data to update.' }, 400)

  try {
    // Find the user in the database
    let userToUpdate = await models.User.findOne({ where: { id: decodedToken.id }})

    if (!userToUpdate)
      return err({ 'type': 'user', 'message': 'Couldn\'t find your account.' })
    else { // If we found the user
      if (userToUpdate.isVerified) { // If user has been verified
        // Update the user
        if (req.body.hasOwnProperty('name') && req.body.name.length)
          userToUpdate.name = req.body.name
        // Save the user
        const savedUser = await userToUpdate.save()

        let response = {
          'success': true,
          'user': {
            id: userToUpdate.id,
            email: userToUpdate.email,
            name: userToUpdate.name,
            displayName: userToUpdate.displayName
          },
          'message': 'User Successfully Updated'
        }
        // Send the response
        console.log('Update User: User successfully updated.  Sending response.')
        return res.send(response)


      } else // User was not verified
        return err({ 'type': 'verification', 'message': 'User not verified.' }, 401)
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
