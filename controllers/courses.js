const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')
const generateFormData = require('../utils/generateFormData')

// @desc    get single course page
// @route   GET /courses/:id
exports.coursePage = asyncUtil(async (req, res, next) => {
  const courseResult = await fetchData(req, {
    method: 'get',
    path: `/courses/${req.params.id}`
  })

  const course = courseResult.data
  return res.render('course', {
    loggedIn: (req.user.id !== undefined),
    user: req.user,
    isMine: (req.user.id === course.Group.UserId),
    course
  })
})

// @desc    get single course edit page
// @route   GET /courses/:id/edit
exports.courseEditPage = asyncUtil(async (req, res, next) => {
  const courseResult = await fetchData(req, {
    method: 'get',
    path: `/courses/${req.params.id}`
  })

  return res.render('courseEdit', {
    course: courseResult.data
  })
})

// @desc    update course info
// @route   PUT /courses/:id
exports.updateCourse = asyncUtil(async (req, res, next) => {
  const formData = generateFormData(req)

  await fetchData(req, {
    method: 'put',
    path: `/courses/${req.params.id}`,
    data: formData,
    config: formData.getHeaders()
  })

  return res.redirect(`/courses/${req.params.id}`)
})

// @desc    delete course
// @route   DELETE /courses/:id
exports.deleteCourse = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'delete',
    path: `/courses/${req.params.id}`
  })

  return res.redirect(`/groups/${req.body.groupId}`)
})

// @desc    create a course review
// @route   POST /courses/:id/reviews
exports.createCourseReview = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'post',
    path: `/courses/${req.params.id}/reviews`,
    data: req.body
  })

  return res.redirect(`/courses/${req.params.id}`)
})
