const fs = require('fs')

exports.getConfig = () => {
  return JSON.parse(fs.readFileSync('config.json'))
}

