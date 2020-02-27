const users = require('./users')

exports.authorization = async (req, res, next) => {
  if(!req.user) next(new Error('Unauthorized'))
  else next()
}

