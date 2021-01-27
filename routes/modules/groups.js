const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { groupsPage, newGroupPage, groupPage, editGroupPage, createGroup, updateGroup, deleteGroup, newGroupCoursePage, createGroupCourse } = require('../../controllers/groups')

// route
router.get('/', groupsPage)
router.get('/new', newGroupPage)
router.get('/:id', groupPage)
router.get('/:id/edit', editGroupPage)
router.post('/', upload.single('photo'), createGroup)
router.put('/:id', upload.single('photo'), updateGroup)
router.delete('/:id', deleteGroup)

router.get('/:id/courses/new', newGroupCoursePage)
router.post('/:id/courses', upload.single('photo'), createGroupCourse)

module.exports = router
