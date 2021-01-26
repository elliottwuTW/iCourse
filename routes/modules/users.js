const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// profile page
router.get('/profile', asyncUtil(async (req, res, next) => {
  const userResult = await fetchData(req, {
    method: 'get',
    path: '/auth/me'
  })
  const followResult = await fetchData(req, {
    method: 'get',
    path: `/users/${req.user.id}/follows`
  })

  return res.render('profile', {
    user: userResult.data,
    follow: followResult.data
  })
}))

// profile edit page
router.get('/profile/edit', asyncUtil(async (req, res, next) => {
  const userResult = await fetchData(req, {
    method: 'get',
    path: '/auth/me'
  })

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

  await fetchData(req, {
    method: 'put',
    path: '/auth/updateprofile',
    data: req.body
  })

  return res.redirect('/users/profile')
}))

module.exports = router
