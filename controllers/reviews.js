const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')

// @desc    delete a review
// @route   DELETE /reviews/:id
exports.deleteReview = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/reviews/${req.params.id}`
  })

  return res.redirect(`/courses/${req.body.courseId}`)
})
