const auth = require('../authorization'),
  users = require('../users')

app.get('/users', auth.authorization, async (req, res, next) => {
  try {
    res.send(await users.ls())
  } catch(err) {
    next(err)
  }
})

app.post('/users', async (req, res, next) => {
  try {
    res.send(
      await users.create(req.body.email, req.body.name, req.body.password)
    )
  } catch(err) {
    next(err)
  }
})

app.get('/users/me', auth.authorization, (req, res, next) => {
  try {
    res.send(req.user)
  } catch(err) {
    next(err)
  }
})

app.delete('/users/logout', auth.authorization, async (req, res, next) => {
  try {
    user = req.user
    req.session.destroy(() => {})
    res.send(user)
  } catch(err) {
    next(err)
  }
})

app.get('/users/:id', auth.authorization, async (req, res, next) => {
  try {
    res.send(await users.get(req.params.id))
  } catch(err) {
    next(err)
  }
})

app.delete('/users/:id', auth.authorization, async (req, res, next) => {
  try {
    res.send(await users.remove(req.params.id))
  } catch(err) {
    next(err)
  }
})

app.post('/users/login', async (req, res, next) => {
  try {
    const user = await users.authenticate(req.body.email, req.body.password)
    if(user) {
      req.session.userId = user._id
      res.send(user)
    } else {
      next(new Error('Unauthorized'))
    }
  } catch(err) {
    next(err)
  }
})


