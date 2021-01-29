const express = require('express')
const router = express.Router()

const { loginPage, login, logout, registerPage, register, forgotPasswordPage, forgotPassword, resetPasswordPage, resetPassword } = require('../../controllers/auth')

// route
router.get('/login', loginPage)
router.post('/login', login)
router.get('/logout', logout)
router.get('/register', registerPage)
router.get('/forgotpassword', forgotPasswordPage)
router.post('/forgotpassword', forgotPassword)
router.get('/resetpassword/:token', resetPasswordPage)
router.put('/resetpassword/:token', resetPassword)
router.post('/register', register)

module.exports = router
