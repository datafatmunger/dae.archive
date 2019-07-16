const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('/data/dae.db')

function randomToken() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
}

exports.create = (userId, name) => {
  const stmt = db.prepare('INSERT INTO Tokens ' + 
    '(user_id, name, token, series) ' +
    'VALUES (?, ?, ?, ?)')
  const token = randomToken()
  const series = randomToken()
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        stmt.run(userId, name, token, series)
        stmt.finalize()
        resolve(true)
      } catch(err) {
        reject(err)
      }
    })
  })
}

exports.remove = (userId, name) => {
  const stmt = db.prepare('DELETE FROM Tokens WHERE name = (?) AND user_id = ?')
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        stmt.run(name, userId)
        stmt.finalize()
        resolve(true)
      } catch(err) {
        reject(err)
      }
    })
  })
}

exports.cookieValue = (token) => {
  return JSON.stringify({
    name: token.name,
    token: token.token,
    series: token.series
  })
}

exports.expireDate = () => {
  return { expires: new Date(Date.now() + 2 * 604800000), path: '/' }
}

