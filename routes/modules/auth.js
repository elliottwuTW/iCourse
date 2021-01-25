const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// login page
router.get('/login', (req, res, next) => {
  return res.render('login')
})

// login
router.post('/login', asyncUtil(async (req, res, next) => {
  const loginResult = await fetchData('post', '/auth/login', req, {
    ...req.body
  })

  if (loginResult.status === 'success') {
    res.cookie('token', loginResult.token)
    return res.redirect('/')
  } else {
    return res.send(loginResult.message)
  }
}))

// logout
router.get('/logout', (req, res, next) => {
  res.cookie('token', '')
  return res.redirect('/')
})

// register page
router.get('/register', (req, res, next) => {
  return res.render('register')
})

// register page
router.post('/register', asyncUtil(async (req, res, next) => {
  const registerResult = await fetchData('post', '/auth/register', req, {
    ...req.body
  })

  if (registerResult.status === 'success') {
    res.cookie('token', registerResult.token)
    return res.redirect('/')
  } else {
    return res.send(registerResult.message)
  }
}))

module.exports = router
