const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// routes
router.get('/', asyncUtil(async (req, res, next) => {
  const groupsResult = await fetchData('get', '/groups', req)

  // get user's following groups to customize page
  let loggedIn
  let groups = groupsResult.data
  if (Object.keys(req.user).length === 0) {
    // current user not logged in
    loggedIn = false
  } else {
    loggedIn = true
    const followGroupsResult = await fetchData('get', `/users/${req.user.id}/follows`, req)

    const followGroupIds = followGroupsResult.data.groups.map(group => group.id)
    groups = groups.map(group => ({
      ...group,
      isFollowed: (followGroupIds.includes(group.id))
    }))
  }

  return res.render('groups', {
    loggedIn,
    groups,
    pagination: groupsResult.pagination
  })
}))

module.exports = router
