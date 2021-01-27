const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')

// @desc    get an user profile
// @route   GET /users/:id/profile
exports.profilePage = asyncUtil(async (req, res, next) => {
  let user
  // following groups
  const followResult = await fetchData(req, {
    method: 'get',
    path: `/users/${req.params.id}/follows`
  })
  // user info
  const isSelf = String(req.user.id) === String(req.params.id)
  if (!isSelf) {
    user = { name: followResult.data.user }
  } else {
    const userResult = await fetchData(req, {
      method: 'get',
      path: `/users/${req.user.id}`
    })
    user = userResult.data
  }

  return res.render('profile', {
    user,
    isSelf,
    follow: followResult.data
  })
})

// @desc    get edit profile page
// @route   GET /users/profile/edit
exports.profileEditPage = asyncUtil(async (req, res, next) => {
  return res.render('profileEdit', {
    user: req.user
  })
})

// @desc    update profile
// @route   PUT /users/profile
exports.updateProfile = asyncUtil(async (req, res, next) => {
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

  return res.redirect(`/users/${req.user.id}/profile`)
})
