const fs = require('fs')
configParser = require('../config-parser')
const config = configParser.getConfig()

const exec = require('child_process').exec
  auth = require('../authorization')

app.post('/upload', auth.authorization, function(req, res, next) {
  console.log(req.files)
  try {
    for(const [key, file] of Object.entries(req.files)) {
      console.log(file)
      const cmd = config.binDir + '/add_file.sh ' +
        file.tempFilePath + ' "' +
        file.name + '" ' +
        req.user.name + ' ' +
        req.body.note || 'API added file'
      console.log('CMD: ', cmd)
      exec(cmd, (error, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        if (error !== null) {
          console.log('exec error: ${error}')
          next(error)
        } else {
          res.send({ status: 'success' })
        }
      })
    }
  } catch(err) {
    next(err)
  }
  
})

