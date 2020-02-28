const express = require('express')
const passport = require('passport')
//const router = express.Router()

/* GET auth callback. */
app.get('/signin', (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next)
  }
)

app.post('/callback', (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next)
  }
)

app.get('/signout', (req, res) => {
    req.session.destroy((err) => {
      req.logout()
      res.redirect('/')
    })
  }
)

//module.exports = router
