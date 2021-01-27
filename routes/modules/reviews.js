const express = require('express')
const router = express.Router()

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')

// delete review
router.delete('/:id', asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/reviews/${req.params.id}`
  })

  return res.redirect(`/courses/${req.body.courseId}`)
}))

module.exports = router
