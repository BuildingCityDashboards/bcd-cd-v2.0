var express = require('express')
var router = express.Router({
  mergeParams: true
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'Cork Dashboard Home' })
})

// redirects for old page
router.get('/home', function (req, res, next) {
  res.redirect(302, '/')
})

router.get('/index', function (req, res, next) {
  res.redirect(302, '/')
})

router.get('/pages/index', function (req, res, next) {
  res.redirect(301, '/')
})

router.get('/.well-known/pki-validation/godaddy.html', function (req, res, next) {
  res.send('f67rjhd2jbo85ti5s6nt4j3hrj')
})

module.exports = router
