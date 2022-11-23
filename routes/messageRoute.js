const express = require('express');
const chatCtrl = require('../controllers/messageCtrl');
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/add-message',auth, chatCtrl.addMessage)
router.get('/get-user-id',auth, chatCtrl.getUserId)
router.post('/add-message-support',auth, chatCtrl.addMessageSupport)
router.get('/get-latest-message',auth, chatCtrl.getAllLatestMessage)
router.get('/get-message/:id',auth, chatCtrl.getAllMessage)

module.exports = router
