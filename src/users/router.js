const { Router } = require('express')
const router = Router()
const controller = require('./controller')
const upload = require('../middlewares/upload')


router.get('/', controller.getUser)
// router.post('/compress', compress)
router.get('/my_profile', controller.getUserBooks)
router.get('/my_profile/:id', controller.getUserBook)
router.put('/my_profile', controller.updateUser)
router.put('/my_profile/password', controller.changePassword)

router.post('/my_profile/add', upload, controller.addBook)
router.put('/my_profile/update/:id', upload, controller.updateBook)
router.delete('/my_profile/delete/:id', controller.deleteBook)

module.exports = router
