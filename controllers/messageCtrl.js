const Chat = require('../models/chatModel')
const LatestMessage = require('../models/latestMessageModel')
const ObjectId = require('mongoose').Types.ObjectId;

const chatCtrl = {
    addMessage: async (req, res) => {
        try {
            const { to, text } = req.body
            // console.log(req.body)
            console.log('user ',to)
            const result = await Chat.create({
                message: text,
                users: [req.user.id, to],
                sender: req.user.id
            })
            const latestMessage = await LatestMessage.findOneAndUpdate({ sender: req.user.id }, {
                latestMessage: text,
                sender: req.user.id
            }, { upsert: true })
            res.send({
                message: 'success',
                data: result
            })


        } catch (error) {
            console.log(error)
        }
    },

    addMessageSupport: async (req, res) => {
        try {
            const { to, text } = req.body
            // console.log(req.body)
            // console.log(req.user.id)
            const result = await Chat.create({
                message: text,
                users: [req.user.id, to],
                sender: req.user.id
            })
            const latestMessage = await LatestMessage.updateOne({ sender: to }, {
                latestMessage: text,
                sender: to
            }, { upsert: true })
            // console.log(latestMessage)
            res.send({
                message: 'success',
                data: result
            })


        } catch (error) {
            console.log(error)
        }
    },

    getAllMessage: async (req, res) => {
        try {
            // const { to, } = req.body
            // console.log(req.params.id)
            const { id } = req.params
            // console.log(req.id)
            // console.log(ObjectId.isValid(id))

            if (!ObjectId.isValid(id)) return res.send({
                data: []
            })
            const result = await Chat.find({
                users: { $all: [req?.user?.id, id] }
            })
            // console.log(result)
            const findResult = result.map((message) => {
                return {
                    fromSelf: message.sender.toString() === req?.user?.id,
                    message: message.message
                }
            })

            res.send({
                message: 'success',
                data: findResult
            })

        } catch (error) {
            console.log(error)
        }
    },

    getAllLatestMessage: async (req, res) => {
        try {
            const result = await LatestMessage.find({}).populate('sender','-password -saved ').sort({ updatedAt: -1 })
            res.send({
                message: 'Success',
                data: result
            })
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    },

    getUserId: async (req, res) => {
        try {
            res.send({
                data:req.user.id
            })
            // console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = chatCtrl
