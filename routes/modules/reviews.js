const express = require('express')
const router = express.Router()

const { deleteReview } = require('../../controllers/reviews')

// delete review
router.delete('/:id', deleteReview)

module.exports = router
