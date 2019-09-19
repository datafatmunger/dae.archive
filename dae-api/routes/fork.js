const auth = require('../authorization'),
  archives = require('../archives')

app.post('/fork', auth.authorization, async (req, res, next) => {
  try {
    res.send({ success:
      await archives.fork(req.body.archive, req.user.name)
    })
  } catch(err) {
    next(err)
  }
})


