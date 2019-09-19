
const exec = require('child_process').exec

exports.fork = (archive, user) => {
  return new Promise((resolve, reject) => {
    exec('/usr/local/bin/fork.sh ' +
      archive + ' ' +
      username, (error, stdout, stderr) => {
        if(error) reject(error)
        resolve(true)
      })
  })
}

