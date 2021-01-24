const express = require('express')
const router = express.Router()

// middleware
const currentUser = require('../middleware/currentUser')

// modules
const groups = require('./modules/groups')
const auth = require('./modules/auth')

router.get('/', (req, res) => res.redirect('/groups'))
router.use('/auth', auth)
router.use('/groups', currentUser, groups)

module.exports = router
