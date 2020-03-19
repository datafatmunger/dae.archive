const users = require('./users')

exports.authorization = async (req, res, next) => {
  //if(!req.user) next(new Error('Unauthorized'))
  //else next()
  console.log('SESSION', req.session)
  if(!req.session || !req.session.userId) next(new Error('Unauthorized'))
  else {
    try {
      const user = await users.get(req.session.userId)
      req.user = user
      next()
    } catch(err) {
      next(err)
    }
  }
}

