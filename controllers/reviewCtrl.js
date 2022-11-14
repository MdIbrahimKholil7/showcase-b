const mongoose = require('mongoose');
const Review = require('../models/reviewModel')


const reviewCtrl = {
    postReview: async (req, res) => {
        try {
            
            const { review, star, productId } = req.body || {}
            const reviewCreate = new Review({
                review,
                star,
                productId,
                userId: req.user.id
            })

            const result = await reviewCreate.save()
            if (result._id) {
                console.log(result)
                res.status(200).json({
                    message: 'Success',
                    data: result
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                data: 'Internal server error'
            })
        }
    },
    getReview: async (req, res) => {
        try {
            const result = await Review.find({}).sort({ createdAt: -1 }).populate('userId', '-password')
        
            if (result) {
                res.send({
                    message: 'Success',
                    data: result
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Internal server error"
            })
        }
    },
    reviewAccepted: async (req, res) => {
        try {
            const { id } = req.params || {}
         
            const result = await Review.findByIdAndUpdate(id, { accepted: true })
      
            if (result) {
                res.status(200).send({
                    message: 'Success',
                    data: result
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error'
            })
        }
    },
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params || {}
          
            const result = await Review.findByIdAndDelete(id)
           
            if (result) {
                res.status(200).send({
                    message: 'Success',
                    data: result
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error'
            })
        }
    },
    getAcceptedReview: async (req, res) => {
        try {
            const result = await Review.find({accepted:true}).sort({ createdAt: -1 }).populate('userId', '-password').limit(10)
          
            if (result) {
                res.send({
                    message: 'Success',
                    data: result
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Internal server error"
            })
        }
    },
}

module.exports = reviewCtrl