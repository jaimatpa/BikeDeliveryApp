const changePassword = require('./user/changePassword')
const allUsers = require('./user/allUsers')
const updateUser = require('./user/updateUsers')
const deleteUser = require('./user/deleteUser')
const restoreUsers = require('./user/restoreUsers')

const upload = require('./upload')

module.exports = {
  create: (app) => {
    // Create the routes
    app.use('/api/user/changePassword', changePassword)
    app.use('/api/user/allUsers', allUsers)
    app.use('/api/user/restoreUsers', restoreUsers)
    app.use('/api/user/updateUser', updateUser)
    app.use('/api/user/deleteUser', deleteUser)

    app.use('/api/upload', upload)
  }
}
