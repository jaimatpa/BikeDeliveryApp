# bba-client

## Build Setup

## Configuration
* Rename `env.example` from `bba-client/env.example` to `bba-client/.env`
* Modify the `.env` file to configure the server's settings.

### App Settings
* `APP_NAME` - Used to identify the application when sending emails
* `BASE_URL` - The URL for the client application
* `API_URL` - The URL for the server application

### Server Settings
* `PORT` - The port number that the server will run on (Default: 3000)

```bash
# go to project folder
$ cd bba-client

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn run start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


# bba-server

BBA Server is the REST-API server for the BBA client application.

## Requirements

* A MySQL Server running with a database created
* The MySQL Event Scheduler must be enabled (`SET GLOBAL event_scheduler = ON;`).  This is to support the automatic expiring of validation tokens.

## Configuration
* Rename `env.example` from `bba-server/env.example` to `bba-server/.env`
* Modify the `.env` file to configure the server's settings.
* Update `SEED=1` in `.env` file

### App Settings
* `APP_NAME` - Used to identify the application when sending emails
* `APP_EMAIL` - The email address in which the application sends FROM
* `BASE_URL` - The URL for the server application
* `CLIENT_URL` - The URL for the client application

### Server Settings
* `PORT` - The port number that the server will run on (Default: 3100)
* `JWT_SECRET` - The secret key of JWT

### Database Settings
* `DB_HOST`
* `DB_USER`
* `DB_PASSWORD`
* `DB_NAME`

### SMTP Settings
* `SMTP_USER`
* `SMTP_SERVER`
* `SMTP_PASSWORD`
* `SMTP_PORT`

```bash
# go to project folder
$ cd bba-server

# install dependencies
$ yarn install

# migrate database
$ npx sequelize db:migrate

# serve with hot reload at localhost
$ yarn run dev # It will run both client(bba-client) and server(bba-server)

# build for production and launch server
$ yarn run start

```
### Default Login credential
Email: admin@paradynamix.com
Password: password

