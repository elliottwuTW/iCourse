const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const asyncUtil = require('../../middleware/asyncUtil')

const fetchData = require('../../utils/fetchData')
const generateFormData = require('../../utils/generateFormData')

// get single course
router.get('/:id', asyncUtil(async (req, res, next) => {
  const courseResult = await fetchData(req, {
    method: 'get',
    path: `/courses/${req.params.id}`
  })

  const course = courseResult.data
  return res.render('course', {
    isMine: (req.user.id === course.Group.UserId),
    course
  })
}))

// course edit page
router.get('/:id/edit', asyncUtil(async (req, res, next) => {
  const courseResult = await fetchData(req, {
    method: 'get',
    path: `/courses/${req.params.id}`
  })

  return res.render('courseEdit', {
    course: courseResult.data
  })
}))

// update course info
router.put('/:id', upload.single('photo'), asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  await fetchData(req, {
    method: 'put',
    path: `/courses/${req.params.id}`,
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/courses/${req.params.id}`)
}))

// update course info
router.delete('/:id', asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/courses/${req.params.id}`
  })

  return res.redirect(`/groups/${req.body.groupId}`)
}))

module.exports = router
