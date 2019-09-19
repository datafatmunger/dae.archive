const auth = require('../authorization'),
  archives = require('../archives')

app.post('/fork', auth.authorization, async (req, res, next) => {
  try {
    res.send({ success:
      await archives.fork(req.user, req.body.archive)
    })
  } catch(err) {
    next(err)
  }
})


