const auth = require('../authorization'),
  users = require('../users'),
  tokens = require('../tokens')

const cookieName = 'dae.token'

app.post('/users', async (req, res, next) => {
  try {
    res.send(
      await users.create(req.body.email, req.body.name, req.body.password)
    )
  } catch(err) {
    next(err)
  }
})

app.delete('/users/logout', auth.authorization, async (req, res, next) => {
  try {
    user = req.user
    res.clearCookie(cookieName)
    await tokens.remove(user.id, cookieName)
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
      req.session.userId = user.id
      console.log('1')
      await tokens.remove(user.id, cookieName)
      console.log('2')
      const token = await tokens.create(user.id, cookieName)
      console.log('3')
      res.cookie(cookieName, tokens.cookieValue(token), tokens.expireDate())
      res.send(user)
    } else {
      next(new Error('Unauthorized'))
    }
  } catch(err) {
    next(err)
  }
})


