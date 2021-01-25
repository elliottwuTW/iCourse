const asyncUtil = require('./asyncUtil')

module.exports = asyncUtil(async (req, res, next) => {
  const fetchData = require('../utils/fetchData')
  const token = req.cookies.token

  // no token
  if (!token) {
    req.user = {}
    return next()
  }

  const response = await fetchData('get', '/auth/me', req)

  // put current user into req.user
  if (response.status === 'success') {
    req.user = response.data
  } else {
    req.user = {}
  }
  next()
})
