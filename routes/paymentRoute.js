const express = require('express');
const paymentCtrl = require('../controllers/paymentCtrl');
const router=express.Router()

router.route('/createOrder').get(paymentCtrl.getApiKey).post(paymentCtrl.order)
router.route('/paymentVerification').post(paymentCtrl.verifyPayment)
router.get('/getPaymentDetails/:id',paymentCtrl.getPaymentDetails)
router.get('/allPayment',paymentCtrl.getAllPaymentDetails)
module.exports=router
