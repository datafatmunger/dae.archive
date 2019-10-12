const fs = require('fs')
configParser = require('./config-parser')
const config = configParser.getConfig()

const exec = require('child_process').exec

exports.fork = (archive, username) => {
  return new Promise((resolve, reject) => {
    exec(config.binDir + '/fork.sh ' +
      archive + ' ' +
      username, (error, stdout, stderr) => {
        if(error) reject(error)
        resolve(true)
      })
  })
}

