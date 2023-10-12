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
const webHookRoutes = require('./webHook/index.js');
// Import auth middleware
const auth = require('./middleware/auth');

// Create the express server
const app = express();
app.use(cors({
  origin: '*',
  allowedHeaders: [ 'Accept-Version', 'Access-Control-Allow-Origin' , 'Authorization', 'Credentials', 'Content-Type' ]
}));
const cookieParser = require("cookie-parser");

// Create Sequelize Models
const models = require('./models');
const { webhook } = require('twilio')
const AWS = require('aws-sdk');
const { KeyContext } = require('twilio/lib/rest/api/v2010/account/key.js')
AWS.config.update({
  accessKeyId: process.env.AWSAccessKey,
  secretAccessKey: process.env.AWSSecretAccessKey
});
AWS.config.region = process.env.AWSRegion;

let s3 = new AWS.S3({params: {Bucket: 'bike-app-storage', Prefix: 'D-Apr0020-22/', Delimiter: '/'}});
// console.log(s3.listObjects());
// let imageFolder = s3.getObject({Key: 'D-Apr0020-22'}, function(err, file) {
//   console.log("FILE", file);
// });
// console.log("IMAGE FOLDER", imageFolder);
// s3.listObjectsV2(function (err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//     data.Contents.forEach(imageObject => {
//       let key = imageObject.Key;
//       let splitKey = key.split('/');
//       console.log(splitKey[1]);
//     })
//   }
// })




async function getImage() {
  console.log("In Get Image");
  const data = s3.getObject({
    Bucket: '',
  }).promise();
  return data;
}

function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64;
}

// Configure & Initialize Sentry
// Sentry.init({
//   dsn: process.env.SENTRY_DSN,

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

async function start () {
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: false, limit: '10mb' }))

  // Initialize Finale
  finale.initialize({ app: app, sequelize: models.sequelize })

  // Create unprotected routes
  apiRoutesUnprotected.create(app)

  // Protect all API endpoints from unauthorized access
  app.use('/api', auth)


  // Create protected routes
  apiRoutesProtected.create(app)

  webHookRoutes.create(app)
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
      consola.error('Unable to connect to the database', err)
    })
}

start()
