const express = require('express'),
  session = require('express-session'),
  fileUpload = require('express-fileupload'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  SQLiteStore = require('connect-sqlite3')(session),
  fs = require('fs'),
  configParser = require('./config-parser')

const config = configParser.getConfig()
const database = config.dataDir

console.log(config)
console.log(database)

app = express()
app.use(express.static('public'))
app.use(session({
  secret: 'popsecret',
  store: new SQLiteStore({
    db: 'dae.db',
    dir: config.dataDir
  }),
  resave: true,
  saveUninitialized: true,
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
require('./routes/user')
require('./routes/file')
require('./routes/fork')

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(JSON.stringify({ error: err.message }))
})

app.listen(3000)

