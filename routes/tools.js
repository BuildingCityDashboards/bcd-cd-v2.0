var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('tools', {
    title: 'Cork Dashboard | Tools',
    active: 'tools'
  })
})

// router.get('/statbank', function (req, res, next) {
//   res.render('tools/tools-statbank', { title: 'Cork Dashboard | CSO Statbank Tool' })
// })

module.exports = router
