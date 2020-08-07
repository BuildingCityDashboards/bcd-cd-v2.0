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

router.get('/transport', function (req, res, next) {
  res.render('transport', {
    title: 'Cork Dashboard | Themes',
    active: 'themes'
  })
})

router.get('/housing', function (req, res, next) {
  res.render('housing', {
    title: 'Cork Dashboard | Themes',
    active: 'themes'
  })
})

module.exports = router
