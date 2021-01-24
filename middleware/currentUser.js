module.exports = async (req, res, next) => {
  const axios = require('axios')
  const token = req.cookies.token

  // no token
  if (!token) {
    req.user = {}
    return next()
  }

  try {
    // api url
    const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'
    const BASE_URL = DOMAIN + '/api/v1'
    const response = await axios.get(BASE_URL + '/auth/me', {
      headers: { authorization: `Bearer ${token}` }
    })

    // put current user into req.user
    if (response.data.status === 'success') {
      req.user = response.data.data
    } else {
      req.user = {}
    }
    next()
  } catch (err) {
    next(err)
  }
}
