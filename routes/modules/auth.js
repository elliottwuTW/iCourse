const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// routes
router.get('/login', (req, res, next) => {
  return res.render('login')
})

router.post('/login', asyncUtil(async (req, res, next) => {
  const result = await fetchData('post', '/auth/login', {
    ...req.body
  })

  if (result.status === 'success') {
    res.cookie('token', result.token)
    return res.redirect('/')
  } else {
    return res.send(result.message)
  }
}))

module.exports = router
