var express = require('express')
var router = express.Router({
  mergeParams: true
})

router.get('/', function (req, res, next) {
  res.render('themes', {
    title: 'Cork Dashboard | Themes',
    active: 'themes'
  })
})

module.exports = router
