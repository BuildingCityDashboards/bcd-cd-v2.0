var express = require('express')
var router = express.Router({
  mergeParams: true
})

router.get('/', function (req, res, next) {
  res.render('queries', {
    title: 'Cork Dashboard | Queries',
    active: 'queries'
  })
})

router.get('/geodemos', function (req, res, next) {
  res.render('queries/geodemos', {
    title: 'Query: Geodemographics',
    page: ''
  })
})

router.get('/live-travel', function (req, res, next) {
  res.render('queries/query_live_travel', {
    title: 'Query: Live Travel',
    page: ''
  })
})

router.get('/live-environment', function (req, res, next) {
  res.render('queries/query_live_travel', {
    title: 'Query: Live Environment',
    page: ''
  })
})

module.exports = router
