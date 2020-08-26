var express = require('express')
var router = express.Router({
  mergeParams: true
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'Cork Dashboard Home' })
})

module.exports = router
