const express = require('express')
const router = express.Router()

const { profilePage, profileEditPage, updateProfile } = require('../../controllers/users')

// route
router.get('/:id/profile', profilePage)
router.get('/profile/edit', profileEditPage)
router.put('/profile', updateProfile)

module.exports = router
