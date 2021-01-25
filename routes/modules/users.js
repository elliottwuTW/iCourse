const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// profile page
router.get('/profile', asyncUtil(async (req, res, next) => {
  const userResult = await fetchData('get', '/auth/me', req)
  const followResult = await fetchData('get', `/users/${req.user.id}/follows`, req)

  return res.render('profile', {
    user: userResult.data,
    follow: followResult.data
  })
}))

// profile edit page
router.get('/profile/edit', asyncUtil(async (req, res, next) => {
  const userResult = await fetchData('get', '/auth/me', req)

  return res.render('profileEdit', {
    user: userResult.data
  })
}))

// profile page
router.put('/profile', asyncUtil(async (req, res, next) => {
  // remove password if not modified
  if (req.body.password === '') {
    delete req.body.password
    delete req.body.passwordConfirm
  }

  await fetchData('put', '/auth/updateprofile', req, req.body)

  return res.redirect('/users/profile')
}))

module.exports = router
