var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('portal', {
    title: 'Cork Dashboard | Portal',
    active: 'portal'
  })
})

module.exports = router
