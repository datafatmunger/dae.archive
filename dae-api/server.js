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

// Configure passport - JBG
const users = {}

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser((user, done) => {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user
  done (null, user.profile.oid)
})

passport.deserializeUser((id, done) => {
  done(null, users[id])
})  

// Callback function called once the sign-in is complete
// and an access token has been obtained
async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."), null)
  }

  try {
    const user = await graph.getUserDetails(accessToken)

    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName
    }

    // Create a simple-oauth2 token from raw tokens
    let oauthToken = oauth2.accessToken.create(params)

    // Save the profile and tokens in user storage
    users[profile.oid] = { profile, oauthToken }
    return done(null, users[profile.oid])

  } catch (err) {
    console.error(err)
    done(err, null)
  }

}

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
))

app = express()
app.use(express.static('public'))
app.use(session({
  secret: 'popsecret',
  store: new MongoStore({ url: 'mongodb://localhost/dae' }),
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

