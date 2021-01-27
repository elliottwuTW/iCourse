const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')
const generateFormData = require('../utils/generateFormData')

// @desc    get all groups (main page)
// @route   GET /groups
exports.groupsPage = asyncUtil(async (req, res, next) => {
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
})

// @desc    new group page
// @route   GET /groups/new
exports.newGroupPage = asyncUtil(async (req, res, next) => {
  return res.render('groupEdit')
})

// @desc    get single group page
// @route   GET /groups/:id
exports.groupPage = asyncUtil(async (req, res, next) => {
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
      isFollowed: (followGroupIds.includes(group.id))
    }
  }

  return res.render('group', {
    loggedIn: (req.user.id !== undefined),
    isMine: (req.user.id === group.User.id),
    group
  })
})

// @desc    get group edit page
// @route   GET /groups/:id/edit
exports.editGroupPage = asyncUtil(async (req, res, next) => {
  const groupResult = await fetchData(req, {
    method: 'get',
    path: `/groups/${req.params.id}`
  })

  return res.render('groupEdit', {
    group: groupResult.data
  })
})

// @desc    create a group
// @route   POST /groups
exports.createGroup = asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  // send POST request to API sever with formData
  const createdGroup = await fetchData(req, {
    method: 'post',
    path: '/groups',
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/groups/${createdGroup.data.id}`)
})

// @desc    update a group info
// @route   PUT /groups/:id
exports.updateGroup = asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  // send PUT request to API sever with formData
  await fetchData(req, {
    method: 'put',
    path: `/groups/${req.params.id}`,
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/groups/${req.params.id}`)
})

// @desc    delete a group
// @route   DELETE /groups/:id
exports.deleteGroup = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/groups/${req.params.id}`
  })

  return res.redirect('/')
})

// @desc    get create group's course page
// @route   GET /groups/:id/courses/new
exports.newGroupCoursePage = asyncUtil(async (req, res, next) => {
  return res.render('courseEdit', {
    groupId: req.params.id
  })
})

// @desc    create a group course
// @route   POST /groups/:id/courses
exports.createGroupCourse = asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  await fetchData(req, {
    method: 'post',
    path: `/groups/${req.params.id}/courses`,
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/groups/${req.params.id}`)
})

// get current user's following groups ids
async function getUserFollowGroupIds (req) {
  const followGroupsResult = await fetchData(req, {
    method: 'get',
    path: `/users/${req.user.id}/follows`
  })
  return followGroupsResult.data.groups.map(group => group.id)
}
