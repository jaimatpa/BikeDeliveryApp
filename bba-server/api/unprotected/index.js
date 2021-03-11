const login = require('./user/login')
const register = require('./user/register')
const verifyEmail = require('./user/verifyEmail')
const sendEmailVerification = require('./user/sendEmailVerification')
const forgotPassword = require('./user/forgotPassword')
const resetPassword = require('./user/resetPassword')

module.exports = {
  create: (app) => {
    // Create the routes
    app.use('/api/user/login', login)
    app.use('/api/user/register', register)
    app.use('/api/user/verifyEmail', verifyEmail)
    app.use('/api/user/sendEmailVerification', sendEmailVerification)
    app.use('/api/user/forgotPassword', forgotPassword)
    app.use('/api/user/resetPassword', resetPassword)
  }
}