const router=require('express').Router()
const auth=require('../middleware/auth')
const asyncHandler=require('../utils/asyncHandler')
const controller=require('../controllers/auth.controller')
router.post('/login',asyncHandler(controller.login))
router.get('/me',auth,asyncHandler(controller.me))
router.post('/logout',auth,asyncHandler(controller.logout))
module.exports=router
