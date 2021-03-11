const finale = require('finale-rest')
const models = require('./models');

const changePassword = require('./changePassword')
const updateUser = require('./update')

module.exports = {
  create: (app) => {
    // Create the routes
    app.use('/api/user/changePassword', changePassword)
    app.use('/api/user/update', updateUser)
    app.use('/api/upload', upload)

    // User
    finale.resource({
      model: models.User,
      excludeAttributes: ['password'],
      endpoints: ['/api/users', '/api/users/:id'],
      actions: ['list', 'read']
    })

  }
}
