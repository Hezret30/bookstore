const { Router } = require('express')
const router = Router()
const controller = require('./controller')


router.get('/', controller.getBooks)
router.get('/categories', controller.getCategories)

router.get('/:id', controller.getBook)

router.get('/categories/:id', controller.getBooksByCategory)



module.exports = router
