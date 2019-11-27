const fs = require('fs')
configParser = require('../config-parser')
const config = configParser.getConfig()

const exec = require('child_process').exec
  auth = require('../authorization')

function execCmd(cmd, req, res, next) {
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

app.post('/files', auth.authorization, function(req, res, next) {
  console.log(req.files)
  try {
    for(const [key, file] of Object.entries(req.files)) {
      // Set a default note if necessary - JBG
      let note = req.body.note
      note = note && note.length ? note : '"API added file"'
      const cmd = config.binDir + '/add_file.sh ' +
        file.tempFilePath + ' "' +
        file.name + '" ' +
        req.user.name + ' ' +
        note
      console.log('CMD: ', cmd)
      execCmd(cmd, req, res, next)
    }
  } catch(err) {
    next(err)
  }
})

app.delete('/files/:id', auth.authorization, function(req, res, next) {
  try {
    const filename = req.params.id
    let note = req.query.note
    note = note && note.length ? note : `"API delete file: ${filename}"`
    console.log("DELETE", filename, note)
    const cmd = config.binDir + '/rm_file.sh "' +
      filename + '" ' +
      req.user.name + ' ' +
      note
    console.log('CMD: ', cmd)
    execCmd(cmd, req, res, next)
  } catch(err) {
    next(err)
  }
})

