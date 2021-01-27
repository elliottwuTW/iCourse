const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { coursePage, courseEditPage, updateCourse, deleteCourse, createCourseReview } = require('../../controllers/courses')

// route
router.get('/:id', coursePage)
router.get('/:id/edit', courseEditPage)
router.put('/:id', upload.single('photo'), updateCourse)
router.delete('/:id', deleteCourse)
router.post('/:id/reviews', createCourseReview)

module.exports = router
