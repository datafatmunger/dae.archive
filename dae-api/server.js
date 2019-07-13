const express = require('express'),
    session = require('express-session'),
    fileUpload = require('express-fileupload'),
    MongoStore = require('connect-mongo')(session),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    models = require('./models'),
    errors = require('./errors'),
    fs = require('fs')

let db

app = express()
app.use(express.static('public'))
app.use(session({
  secret: 'popsecret',
  store: new MongoStore({ url: 'mongodb://localhost/dae' }),
  resave: true,
  saveUninitialized: true
}))
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

//configure mongoose models - JBG
models.defineModels(mongoose, () => {
  app.User = User = mongoose.model('User')
  app.LoginToken = LoginToken = mongoose.model('LoginToken')
  db = mongoose.connect('mongodb://localhost/dae', { useNewUrlParser: true, useCreateIndex: true })
})

require('./routes/user')
require('./routes/upload')

app.use((err, req, res, next) => {
  console.error(err.stack)
  if(err instanceof errors.BadRequest) {
    res.status(400).send(JSON.stringify({ error: err.name }))
  } else if(err instanceof errors.Unauthorized) {
    res.status(401).send(JSON.stringify({ error: err.name }))
  } else if (err instanceof errors.NotFound) {
    res.status(404).send(JSON.stringify({ error: err.name }))
  } else if (err instanceof errors.Conflict) {
    res.status(409).send(JSON.stringify({ error: err.name }))
  } else if(err instanceof errors.Unprocessable) {
    res.status(422).send(JSON.stringify({ error: err.name }))
  } else {
    res.status(500).send(JSON.stringify({ error: err.name }))
  }
})

app.listen(8000)

