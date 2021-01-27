const asyncUtil = require('../middleware/asyncUtil')
const fetchData = require('../utils/fetchData')

// login page
exports.loginPage = (req, res, next) => {
  return res.render('login')
}

// login
exports.login = asyncUtil(async (req, res, next) => {
  const loginResult = await fetchData(req, {
    method: 'post',
    path: '/auth/login',
    data: { ...req.body }
  })

  if (loginResult.status === 'success') {
    res.cookie('token', loginResult.token)
    return res.redirect('/')
  } else {
    return res.send(loginResult.message)
  }
})

// logout
exports.logout = (req, res, next) => {
  res.cookie('token', '')
  return res.redirect('/')
}

// register page
exports.registerPage = (req, res, next) => {
  return res.render('register')
}

// register
exports.register = asyncUtil(async (req, res, next) => {
  const registerResult = await fetchData(req, {
    method: 'post',
    path: '/auth/register',
    data: { ...req.body }
  })

  if (registerResult.status === 'success') {
    res.cookie('token', registerResult.token)
    return res.redirect('/')
  } else {
    return res.send(registerResult.message)
  }
})
