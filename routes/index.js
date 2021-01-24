const express = require('express')
const router = express.Router()

// modules
const groups = require('./modules/groups')

router.get('/', (req, res) => res.redirect('/groups'))
router.use('/groups', groups)

module.exports = router
