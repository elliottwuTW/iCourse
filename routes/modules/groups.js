const express = require('express')
const router = express.Router()

// api url
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000'
const BASE_URL = DOMAIN + '/api/v1'

const fetchData = require('../../utils/fetchData')
const viewResponse = require('../../utils/viewResponse')

// routes
router.get('/', async (req, res, next) => {
  const url = BASE_URL + '/groups'
  const result = await fetchData('get', url)

  viewResponse(result, res, 'groups', {
    groups: result.data,
    pagination: result.pagination
  })
})

module.exports = router
