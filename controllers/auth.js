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

  res.cookie('token', loginResult.token)
  return res.redirect('/')
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

// forgot password page
exports.forgotPasswordPage = (req, res, next) => {
  return res.render('forgotpassword')
}

// forgot password
exports.forgotPassword = asyncUtil(async (req, res, next) => {
  const forgotPasswordResult = await fetchData(req, {
    method: 'post',
    path: '/auth/forgotpassword',
    data: { email: req.body.email }
  })
  if (forgotPasswordResult.status === 'success') {
    return res.render('forgotpassword', {
      result: 'Email sent successfully. Please check your email to reset password!'
    })
  }
})

// reset password page
exports.resetPasswordPage = (req, res, next) => {
  return res.render('resetpassword', {
    token: req.params.token
  })
}

// reset password
exports.resetPassword = asyncUtil(async (req, res, next) => {
  const resetPasswordResult = await fetchData(req, {
    method: 'put',
    path: `/auth/resetpassword/${req.params.token}`,
    data: { ...req.body }
  })

  res.cookie('token', resetPasswordResult.token)
  return res.redirect('/')
})
