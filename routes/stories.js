var express = require('express')
var router = express.Router()

/* GET themes page. */
router.get('/', function (req, res, next) {
  res.render('stories', {
    title: 'Cork Dashboard | Stories Page',
    active: 'stories'
  })
})

// router.get('/housing-crisis-phase-1', function (req, res, next) {
//   res.render('stories/housing_crisis_1', {
//     title: 'Housing Crisis Phase 1: 1993-2006 (the Celtic Tiger years)',
//     page: 'page'
//   })
// })

module.exports = router
