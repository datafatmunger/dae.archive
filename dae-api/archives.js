
const exec = require('child_process').exec

function fork(archive, user) {
  return new Promise((resolve, reject) => {
    exec('/usr/local/bin/fork.sh ' +
      archive + ' ',
      user.name)
  })
}

