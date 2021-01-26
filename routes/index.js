const express = require('express')
const router = express.Router()

// middleware
const currentUser = require('../middleware/currentUser')

// modules
const auth = require('./modules/auth')
const groups = require('./modules/groups')
const users = require('./modules/users')
const courses = require('./modules/courses')

router.get('/', (req, res) => res.redirect('/groups'))
router.use('/auth', auth)
router.use('/users', currentUser, users)
router.use('/groups', currentUser, groups)
router.use('/courses', currentUser, courses)

module.exports = router
