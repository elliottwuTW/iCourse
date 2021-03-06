const express = require('express')
const router = express.Router()

// middleware
const currentUser = require('../middleware/currentUser')

// modules
const auth = require('./modules/auth')
const groups = require('./modules/groups')
const users = require('./modules/users')
const courses = require('./modules/courses')
const reviews = require('./modules/reviews')
const orders = require('./modules/orders')

router.get('/', (req, res) => res.redirect('/groups'))
router.use('/auth', auth)
router.use('/users', currentUser, users)
router.use('/groups', currentUser, groups)
router.use('/courses', currentUser, courses)
router.use('/reviews', currentUser, reviews)
router.use('/orders', currentUser, orders)
router.get('/cart', (req, res, next) => {
  return res.render('cart')
})

module.exports = router
