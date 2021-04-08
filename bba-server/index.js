// Server configuration variables
require('dotenv').config()

// Import Libraries
const consola = require('consola')
const cors = require('cors')
const express = require('express')
const finale = require('finale-rest')
const morgan = require('morgan')

// Import Libraries (Sentry Error Logging)
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// Import Database Seeding script
const seed = require('./seed.js') // Seeding

// Import unprotected & protected routes
const apiRoutesUnprotected = require('./api/unprotected/index.js')
const apiRoutesProtected = require('./api/protected/index.js')

// Import auth middleware
const auth = require('./middleware/auth');

// Create the express server
const app = express()

// Create Sequelize Models
const models = require('./models');

// Configure & Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

async function start () {

  // Use CORS middleware
  let corsOptions = {
    origin: '*',
    exposedHeaders: ['Content-Range'],
  }
  app.use(cors(corsOptions))

  // Set Body Parser Middleware
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: false, limit: '10mb' }))
  app.use(express.static(__dirname + '/public'));

  // Initialize Finale
  finale.initialize({ app: app, sequelize: models.sequelize })

  // Create unprotected routes
  apiRoutesUnprotected.create(app)

  // Protect all API endpoints from unauthorized access
  app.use('/api', auth)

  // Create protected routes
  apiRoutesProtected.create(app)

  // Seed the database
  if (process.env.SEED && process.env.SEED == 1) {
    consola.log('Seeding database...')
    await seed()
  }

  // Test database connection
  models.sequelize.authenticate()
    .then(() => {
      consola.success('Database connection established.')
      // Start the server
      const port = process.env.PORT || 8080
      app.listen(port, () => {
        consola.ready({
          message: `Server is running on port ${port}.`,
          badge: true
        })
      })

    })
    .catch((err) => {
      consola.error('Unable to connect to the database', error)
    })
}

start()
