const errors = require('./errors')

exports.authorization = (req, res, next) => {
  if(!req.session.user_id) next(new errors.Unauthorized('no session'))
  else {
    User.findOne({ _id: req.session.user_id }, (err, user) => {
      if(err) {
        next(new errors.NotFound('user not found'))
      } else {
        req.user = user
        next()
      }
    })
  }
}

