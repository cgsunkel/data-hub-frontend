const router = require('express').Router()

function getHandler(req, res) {
  res.breadcrumb('Your profile').render('profile/views/profile')
}

module.exports = {
  router: router.get('/profile', getHandler),
  controllers: {
    getHandler,
  },
}
