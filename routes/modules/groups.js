const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// get all groups
router.get('/', asyncUtil(async (req, res, next) => {
  const groupsResult = await fetchData(req, {
    method: 'get',
    path: '/groups'
  })

  let groups = groupsResult.data

  // add isFollowed if user is logged in
  if (req.user.id) {
    const followGroupIds = await getUserFollowGroupIds(req)
    groups = groups.map(group => ({
      ...group,
      isFollowed: (followGroupIds.includes(group.id)),
      isMine: (req.user.id === group.UserId)
    }))
  }

  return res.render('groups', {
    loggedIn: (req.user.id !== undefined),
    groups,
    pagination: groupsResult.pagination
  })
}))

// create group page
router.get('/new', asyncUtil(async (req, res, next) => {
  return res.render('groupEdit')
}))

// get single group
router.get('/:id', asyncUtil(async (req, res, next) => {
  const groupResult = await fetchData(req, {
    method: 'get',
    path: `/groups/${req.params.id}`
  })

  let group = groupResult.data

  // add isFollowed if user is logged in
  if (req.user.id) {
    const followGroupIds = await getUserFollowGroupIds(req)
    group = {
      ...group,
      isFollowed: (followGroupIds.includes(group.id)),
      isMine: (req.user.id === group.UserId)
    }
  }

  return res.render('group', {
    loggedIn: (req.user.id !== undefined),
    isSelf: (req.user.id === group.User.id),
    group
  })
}))

// group edit page
router.get('/:id/edit', asyncUtil(async (req, res, next) => {
  const groupResult = await fetchData(req, {
    method: 'get',
    path: `/groups/${req.params.id}`
  })

  return res.render('groupEdit', {
    group: groupResult.data
  })
}))

// create group
router.post('/', upload.single('photo'), asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  // send POST request to API sever with formData
  const createdGroup = await fetchData(req, {
    method: 'post',
    path: '/groups',
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/groups/${createdGroup.data.id}`)
}))

// update group info
router.put('/:id', upload.single('photo'), asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  // send PUT request to API sever with formData
  await fetchData(req, {
    method: 'put',
    path: `/groups/${req.params.id}`,
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/groups/${req.params.id}`)
}))

// delete group
router.delete('/:id', asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/groups/${req.params.id}`
  })

  return res.redirect('/')
}))

// get current user's following groups ids
async function getUserFollowGroupIds (req) {
  const followGroupsResult = await fetchData(req, {
    method: 'get',
    path: `/users/${req.user.id}/follows`
  })
  return followGroupsResult.data.groups.map(group => group.id)
}

// parse and generate form data
function generateFormData (req) {
  const FormData = require('form-data')
  const fs = require('fs')

  // parse and generate another form
  const formData = new FormData()
  // fields
  Object.entries(req.body).forEach(entry => {
    formData.append(entry[0], entry[1])
  })
  // photo
  if (req.file) {
    formData.append('photo', fs.createReadStream(`./${req.file.path}`))
  }

  return formData
}

module.exports = router
