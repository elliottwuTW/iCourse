const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// routes
router.get('/', asyncUtil(async (req, res, next) => {
  const result = await fetchData('get', '/groups')

  return res.render('groups', {
    groups: result.data,
    pagination: result.pagination
  })
}))

module.exports = router
