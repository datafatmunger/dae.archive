const mongodb = require('mongodb'),
      MongoClient = mongodb.MongoClient,
      ObjectId = mongodb.ObjectID,
      exec = require('child_process').exec,
      crypto = require('crypto'),
      fs = require('fs'),
      configParser = require('./config-parser')

const config = configParser.getConfig()
const client = new MongoClient(config.mongo.uri, {useUnifiedTopology: true})

function createSalt() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
}

function encryptPassword(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex')
}

function initRepo(name) {
  const cmd = `${config.binDir}/add_file.sh "${config.initPath}/${config.initFile}" "${config.initFile}" "${name}" "added README"`
  console.log('INIT REPO', cmd)
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        if(error) {
          console.error(error)
          reject(error)
        }
        resolve(true)
      })
  })
}

<<<<<<< HEAD
function createSystemUser(name, password, email) {
=======
function execSystemUser(name, password, email) {
>>>>>>> db3f836a513dbf164699124b1e9fa58e4c40ab0a
  return new Promise((resolve, reject) => {
    exec(config.binDir + '/add_user.sh ' +
      name + ' ' +
      password + ' ' +
      email, (error, stdout, stderr) => {
        if(error) reject(error)
        resolve(true)
      })
  })
}

function getUser(email) {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
      db.collection('users').findOne({email: email}, (err, res) => {
        if(err) reject(err)
        else resolve(res)
      })
    })
  })
}

exports.getUser = (email) => {
  return getUser(email)
}

// This code is bad and I feel bad about it :( - JBG

exports.create = (email, name, password) => {
  const salt = createSalt()
  const hash = encryptPassword(password, salt)

  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    db.serialize(async () => {
      stmt.run(email, name, hash, salt)
      stmt.finalize()
      try {
        await createSystemUser(name, password, email)
        await initRepo(name)
        resolve(getUser(email))
      } catch(err) {
        reject(err)
      }
=======
    client.connect().then(client => {
      const db = client.db('dae')
      db.collection('users').findOne(
          {$or: [{email: email}, {name: name}]},
          (err, res) => {
        if(res) reject(new Error('User exists'))
        else {
          const user = {
            email: email,
            name: name,
            salt: salt,
            hash: hash
          }
          db.collection('users').insertOne(user, async (err, res) => {
            if (err) reject(err)
            else {
              try {
                await execSystemUser(user.name, password, user.email)
                await initRepo(name)
                resolve(getUser(email))
              } catch(err) {
                reject(err)
              }
            }
          })
        }
      })
>>>>>>> db3f836a513dbf164699124b1e9fa58e4c40ab0a
    })
  })
}

function serialize(row) {
  return { id: row.id, email: row.email, name: row.name }
}

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUser(email)
      if(user && encryptPassword(password, user.salt) === user.hash)
        resolve(user)
      else reject(new Error('Authentication failure'))
    } catch(err) {
      reject(err)
    }
  })
}

exports.get = (id) => {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
      db.collection('users').findOne({_id: new ObjectId(id)}, (err, res) => {
        if(err) reject(err)
        else resolve(res)
      })
    })
  })
}

function removeSystemUser(name) {
  return new Promise((resolve, reject) => {
    exec(config.binDir + '/rm_user.sh ' + name, (err, stdout, stderr) => {
      if(err) reject(err)
      else resolve(true)
    })
  })
}

exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    client.connect().then(client => {
      const db = client.db('dae')
      db.collection('users').deleteOne({_id: new ObjectId(id)}, (err, res) => {
        if(err) reject(err)
        else resolve(res)
        //resolve(await removeSystemUser(user.name))
      })
    })
  })
}

