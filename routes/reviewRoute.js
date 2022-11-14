const express = require('express');
const reviewCtrl = require('../controllers/reviewCtrl');
const auth = require('../middleware/auth');
const router=express.Router()

router.post('/add-review',auth,reviewCtrl.postReview)
router.get('/get-all-product-details',reviewCtrl.getReview)
router.put('/update-review/:id',reviewCtrl.reviewAccepted)
router.delete('/delete-review/:id',reviewCtrl.deleteReview)
router.get('/getAccepted-review',reviewCtrl.getAcceptedReview)

module.exports=router
