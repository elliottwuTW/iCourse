const express = require('express')
const router = express.Router()

// middleware
const currentUser = require('../middleware/currentUser')

// modules
const groups = require('./modules/groups')

// current user status
router.use(currentUser)

router.get('/', (req, res) => res.redirect('/groups'))
router.use('/groups', groups)

module.exports = router
