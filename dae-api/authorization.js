const users = require('./users'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  OIDCStrategy = require('passport-azure-ad').OIDCStrategy,
  graph = require('./graph'),
  configParser = require('./config-parser')

const config = configParser.getConfig()
const client = new MongoClient(config.mongo.uri, {useUnifiedTopology: true})

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

exports.authorization = async (req, res, next) => {
  // Passport auth check - JBG
  if(req.user) {
    const user = await users.getUser(req.user.profile.email)
    // See if user has system user - JBG
    if(user) {
      req.user.name = user.name 
      next()
    }
    // No system user, suggest making one - JBG
    else res.status(301).send({location: '/search/createUser'})
  }
  // Cookie auth - JBG
  else if(req.session && req.session.userId) {
    try {
      const user = await users.get(req.session.userId)
      req.user = user
      next()
    } catch(err) {
      next(err)
    }
  }
  else next(new Error('Unauthorized'))
}

function storeTokens(tokens) {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
        db.collection('tokens').insertOne(tokens, async (err, res) => {
          if (err) reject(err)
          else resolve(res) 
        })
    })
  })
}

function updateTokens(tokens) {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
        db.collection('tokens').update({oid: tokens.profile.oid}, tokens, async (err, res) => {
          if (err) reject(err)
          else resolve(res) 
        })
    })
  })
}

// Configure passport - JBG
const storage = {}

// Callback function called once the sign-in is complete
// and an access token has been obtained - JBG
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
    const tokens = { profile, oauthToken }
    //await storeTokens(tokens)
    storage[profile.oid] = tokens

    console.log("WHAT", tokens, profile.oid)

    return done(null, tokens)
  } catch (err) {
    console.error(err)
    done(err, null)
  }
}

exports.serializeUser = (user, done) => {
  updateTokens(user)
    .then(res => done(null, user.profile.oid)).catch(err => done(err, null))
  //storage[user.profile.oid] = user
}

function getTokens(id) {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
      db.collection('tokens').findOne({'profile.oid': id}, (err, res) => {
        if(err) reject(err)
        else resolve(res)
      })
    })
  })
}

exports.deserializeUser = (id, done) => {
  getTokens(id)
    .then(tokens => {
      console.log("DESERIALIZE", tokens, id)
      done(null, tokens)
    }).catch(err => done(err, null))
  //done(null, storage[id])
}

exports.getOIDC = () => {
  return new OIDCStrategy({
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
   }, signInComplete)
>>>>>>> db3f836a513dbf164699124b1e9fa58e4c40ab0a
}

