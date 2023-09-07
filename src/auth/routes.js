const { Router } = require('express')
const router = Router()
const controller = require('./controller')
const sendEmail = require('../emailConfig/index')
const SchemaValidate = require('../schemas/validation')
const { signUp } = require('../schemas/schemas')

router.post("/sign_in", controller.sign_in)
router.post("/sign_up", SchemaValidate(signUp), controller.sign_up, sendEmail)
router.get("/refresh_token", controller.refresh_token)


module.exports = router
