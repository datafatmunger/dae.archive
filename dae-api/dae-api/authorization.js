const users = require('./users')

exports.authorization = async (req, res, next) => {
  if(!req.user) {
    res.status(401).send(JSON.stringify({error: "Unauthorized"}))
  }
  else next()
}

