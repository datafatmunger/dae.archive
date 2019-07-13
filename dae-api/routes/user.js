const exec = require('child_process').exec
  crypto = require('crypto'),
  errors = require('../errors'),
  auth = require('../authorization')

app.get('/users/:id', auth.authorization, (req, res) => {
  res.send(req.user.serialize())
})

app.get('/users', auth.authorization, async (req, res, next) => {
  try {
    if(req.query.name)  {
      const users = await User.find({name: req.query.name})
      res.send(users.map(user => user.serialize()))
    } else {
      const users = await User.find({})
      res.send(users.map(user => user.serialize()))
    }
  } catch(err) {
    next(err)
  }
})

app.post('/users', async (req, res, next) => {
  try {
    if(!req.body.email) next(new errors.Unprocessable('no email'))
    else {
      let user = await User.findOne({ email: req.body.email })
      if(user) next(new errors.Conflict('user exists'))
      else {
        user = new User(req.body)
        await user.save()
        exec('/usr/local/bin/add_user.sh ' +
          req.body.name + ' ' +
          req.body.password + ' ' +
          req.body.email, (error, stdout, stderr) => {
            if(error) next(error)
            else {
              req.session.user_id = user.id
              res.send(user.serialize())
            }
          })
      }
    }
  } catch(err) {
    next(err)
  }
})

app.put('/users/:id', auth.authorization, async (req, res, next) => {
  try {
    let user = await User.findOne({ _id : req.params.id })
    if(req.body.city) user.city = req.body.city
    if(req.body.password) user.password = req.body.password
    if(req.body.name) user.name = req.body.name
    await user.save()
    res.send(user.serialize())
  } catch(err) {
    next(err)
  }
})

app.delete('/users/:id', auth.authorization, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id : req.params.id })
    await user.remove()
    exec('/usr/local/bin/rm_user.sh ' + user.name, (error, stdout, stderr) => {
      if(error) next(error)
      else {
        res.send(user.serialize())
      }
    })
  } catch(err) {
    next(err)
  }
})

app.post('/users/login', async (req, res, next) => {
  try {
    if(!req.body.email) next(new errors.Unprocessable('no user email'))
    else {
      const user = await User.findOne({ email: req.body.email })
      if(user && user.authenticate(req.body.password)) {
        req.session.user_id = user.id
        const loginToken = new LoginToken({ email: user.email })
        await loginToken.save()
        res.cookie(
          'logintoken',
          loginToken.cookieValue,
          { expires: new Date(Date.now() + 2 * 604800000), path: '/' })
        res.send(user.serialize())
      } else {
        next(new errors.Unauthorized('didn\'t authenticate'))
      }
    }
  } catch(err) {
    next(err)
  }
})

app.delete('/users/:id/logout', auth.authorization, async (req, res, next) => {
  try {
    user = req.user
    res.clearCookie('logintoken')
    await LoginToken.remove({ email: user.email }, () => {})
    req.session.destroy(() => {})
    res.send(user.serialize)
  } catch(err) {
    next(err)
  }
})

app.post('/users/forgot', async (req, res, next) => {
  try {
    if(!req.body.email) next(new errors.Unprocessable('no user email'))
    else {
      let user = await User.findOne({ email: req.body.email })
      const token = crypto.randomBytes(16).toString('hex')
      const expires = Date.now() + 3600000
      user.forgotToken = token
      user.forgotExpires = expires
      await user.save()
      res.send(token)
    }
  } catch(err) {
    next(err)
  }
})

app.post('/users/reset', async (req, res, next) => {
  try {
    if(!req.body.email) next(new errors.Unprocessable('no user email'))
    else {
      let user = await User.findOne({ email: req.body.email })
      if(user && user.forgotToken === req.body.token) {
        user.password = req.body.password
        await user.save()
        res.send(user.serialize())
      }
    }
  } catch(err) {
    next(err)
  }
})

