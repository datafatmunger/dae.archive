const sqlite3 = require('sqlite3').verbose(),
  exec = require('child_process').exec,
  crypto = require('crypto')

const fs = require('fs')
configParser = require('./config-parser')
const config = configParser.getConfig()

const db = new sqlite3.Database(config.dataDir + '/dae.db')

function createSalt() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
}

function encryptPassword(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex')
}

function initRepo(name) {
  const cmd = `${config.binDir}/add_file.sh "${config.initPath}/${config.initFile}" "${config.initFile}" "${name}" "added README"`
  console.log("INIT REPO", cmd)
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

function createSystemUser(name, password, email) {
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
  const stmt = `SELECT * FROM Users WHERE email = "${email}"`
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(stmt, (err, row) => {
        if(err) reject(err) 
        resolve(serialize(row))
      })
    })
  })
}

exports.create = (email, name, password) => {
  const stmt = db.prepare('INSERT INTO Users ' + 
    '(email, name, hash, salt) ' +
    'VALUES (?, ?, ?, ?)')
  const salt = createSalt()
  const hash = encryptPassword(password, salt)
  return new Promise((resolve, reject) => {
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
    })
  })
}

function serialize(row) {
  return { id: row.id, email: row.email, name: row.name }
}

exports.authenticate = (email, password) => {
  const stmt = `SELECT * FROM Users WHERE email = "${email}"`
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(stmt, (err, row) => {
        if(err) reject(err) 
        else if(!row) reject(new Error('User not found'))
        else if(encryptPassword(password, row.salt) == row.hash) {
          resolve(serialize(row))
        } else reject(new Error('Authentication failure'))
      })
    })
  })
}

exports.get = (id) => {
  const stmt = `SELECT * FROM Users WHERE id = ${id}`
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(stmt, (err, row) => {
        if(err) reject(err) 
        else if(!row) reject(new Error('User not found'))
        else resolve(serialize(row))
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
  const stmt = `DELETE FROM Users WHERE id = ${id}`
  return new Promise(async (resolve, reject) => {
    try {
      const user = await this.get(id)
      db.serialize(() => {
        db.run(stmt, async (err, row) => {
          if(err) reject(err) 
          else {
            resolve(await removeSystemUser(user.name))
          }
        })
      })
    } catch(err) {
      reject(err)
    }
  })
}

