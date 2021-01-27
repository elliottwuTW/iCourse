const express = require('express')
const router = express.Router()

const { loginPage, login, logout, registerPage, register } = require('../../controllers/auth')

// route
router.get('/login', loginPage)
router.post('/login', login)
router.get('/logout', logout)
router.get('/register', registerPage)
router.post('/register', register)

module.exports = router
