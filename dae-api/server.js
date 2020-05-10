require('dotenv').config()
const express = require('express'),
  session = require('express-session'),
  fileUpload = require('express-fileupload'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  MongoStore = require('connect-mongo')(session),
  fs = require('fs'),
  configParser = require('./config-parser')
  createError = require('http-errors')
  path = require('path')
  logger = require('morgan')
  flash = require('connect-flash')
  passport = require('passport')
  OIDCStrategy = require('passport-azure-ad').OIDCStrategy
  graph = require('./graph')
  auth = require('./authorization')

const config = configParser.getConfig()
const database = config.dataDir

console.log(config)
console.log(database)

// Configure simple-oauth2 - JBG
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
})

passport.serializeUser(auth.serializeUser)
passport.deserializeUser(auth.deserializeUser)  

// Configure OIDC strategy - JBG
passport.use(auth.getOIDC())

app = express()
app.use(express.static('public'))
app.use(session({
  secret: 'popsecret',
  store: new MongoStore({ url: config.mongo.uri }),
  resave: true,
  saveUninitialized: true,
  unset: 'destroy'
}))

// Flash middleware
app.use(flash())

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(methodOverride())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
require('./routes/user')
require('./routes/file')
require('./routes/fork')
require('./routes/auth')

//const authRouter = require('./routes/auth')
//app.use('/auth', authRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(JSON.stringify({ error: err.message }))
})

app.listen(3000)

