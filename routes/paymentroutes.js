const express = require('express')
const mongoose = require('mongoose');
const auth = require('../middleware/auth')
const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Users = require('../models/userModel')
const { findOneAndUpdate } = require('../models/userModel');
const paymentModel = require('../models/paymentModel')
const Payment = new mongoose.model('payment', paymentModel)

router.post("/orders", async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

router.put("/verify", async (req, res) => {
	let amount
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body.response;
		console.log('payment verify', req.body)
		console.log(req.body.pay)
		if (req.body.pay === 400) {
			amount = 'Silver'
		}
		if (req.body.pay === 700) {
			amount = 'Gold'
		}
		if (req.body.pay === 1000) {
			amount = 'Platinum'
		}


		const { _id, name, email } = req.body.userDetails
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {

			const result = await Payment.updateOne({email},{
				userId: _id,
				name,
				email,
				transactionId: razorpay_payment_id,
				plan: amount
			},{ upsert: true })
			console.log(result)
			return res.status(200).json(
				{
					message: "Payment verified successfully"
				}
			);
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

router.get('/get-payment-details', async (req, res) => {
	try {
		console.log(req.query)
		const result = await Payment.findOne({ email: req.query.email })
		console.log(result)
		res.status(200).send({
			message: 'Success',
			data: result
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({ message: 'Internal Server Error!' })
	}
})


// router.patch("/changerole", auth, async (req, res) => {
// 	try {


// 		const user = await Users.findById(req.user.id)
// 		if (!user) return res.status(400).json({ msg: "User does not exist." })


// 		const response = await Users.findOneAndUpdate({ _id: req.user.id }, {
// 			role: req.body.role
// 		})

// 		return res.json({ msg: "Role changed" })
// 	} catch (err) {
// 		return res.status(500).json({ msg: err.message })
// 	}
// });

module.exports = router;