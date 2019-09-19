const auth = require('../authorization'),
  archives = require('../archives')

app.post('/fork', authorization, async (req, res, next) => {
  try {
    res.send(
      await archives.fork(req.user, req.body.archive)
    )
  } catch(err) {
    next(err)
  }
})


