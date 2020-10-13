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
  // alert('you clicked q1')
  res.render('queries/geodemos', {
    title: 'Query: Geodemographics',
    page: ''
  })
})

router.get('/livetravel', function (req, res, next) {
  // alert('you clicked q1')
  res.render('queries/query_live_travel', {
    title: 'Query: Live Travel',
    page: ''
  })
})

// router.get('/geodemosHM', function (req, res, next) {
//   // alert('you clicked q1')
//   res.render('queries/geodemosHM', {
//     title: 'Query: Geodemographics',
//     page: ''
//   })
// })

module.exports = router
