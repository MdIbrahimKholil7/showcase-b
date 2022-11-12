const { response } = require('express');
const ProUser = require('../models/productModel')
const Women = require('../models/womenProModel')
const Kids = require('../models/kidsProModel')
const Men = require('../models/menProModel')
const HomeKitchen = require('../models/home-kitchenProModel')
const Users = require('../models/userModel')
const { ObjectId } = require('mongodb');
// Filter, sorting and paginatin
let count;

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //    gte = greater than or equal
        //    lte = lesser than or equal
        //    lt = lesser than
        //    gt = greater than
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}



// for posting video 
const saveVideo = async (Collection, data, res) => {
    const { link, companyName, email, productBrand, productType, category, price, description, userId, discount, videoOwner } = data?.data || {};
    // console.log('data', data?.video)
    // console.log('from data',data)
    const newProduct = new Collection({
        link: data?.video,
        companyName,
        email,
        brand: productBrand,
        type: productType,
        category,
        price,
        Description: description,
        discount,
        userId: data?.userId,
        videoOwner: data?.videoOwner
    })
    const result = await newProduct.save()

    const newItem = new ProUser({
        link: data?.video,
        companyName,
        email,
        brand: productBrand,
        type: productType,
        category,
        price,
        Description: description,
        discount,
        productId: result?._id,
        userId,
        videoOwner: data?.videoOwner
    })

    const itemResult = await newItem.save()
    console.log('result', result)
    res.json({ msg: "Created a product", result })
}



const productCount = async (collection, content,) => {
    if (content) {
        const results = collection.find({ category: new RegExp(content, 'i') })
        count = await results.count()
    } else {
        const results = collection.find()
        count = await results.count()
    }

}




const productCtrl = {

    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(ProUser.find(), req.query)
                .filtering().sorting().paginating()

            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getAdminVideo: async (req, res) => {
        try {
            console.log('user', req.user.id)


            const result = await ProUser.find({ userId: req.user.id })
            res.status(200).send({
                message: 'Success',
                data: result
            })
        } catch (error) {
            console.log(error)
        }
    },

    createProduct: async (req, res) => {
        try {
            const { link, companyName, email, productBrand, productType, category, price, Description, latitude, longitude, } = req.body.data || {};
            console.log('createProduct', req.body);

            if (!req?.body?.video) return res.status(400).json({ msg: "No video upload" })

            const product = await ProUser.findById(req?.user?.id)

            if (product)
                return res.status(400).json({ msg: "This product already exists." })

            if (productType === 'Women') {
                saveVideo(Women, req?.body, res)
            }
            if (productType === 'Kids') {
                saveVideo(Kids, req?.body, res)
            }
            if (productType === 'Men') {
                saveVideo(Men, req?.body, res)
            }
            if (productType === 'Home&Kitchen') {
                saveVideo(HomeKitchen, req?.body, res)
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getMinPrice: async (req, res) => {

        try {
            const { content } = req.query || {}
            console.log(content)
            switch (content) {

                case 'Men':
                    const min = await Men.find().sort({ price: 1 }).limit(1)
                    const max = await Men.find().sort({ price: -1 }).limit(1)
                    console.log(min,max)
                    return res.status(200).send({
                        data: {
                            min: min[0]?.price,
                            max: max[0]?.price,
                        }
                    })
                case 'Women':
                    const minWP = await Women.find().sort({ price: 1 }).limit(1)
                    const maxWP = await Women.find().sort({ price: -1 }).limit(1)
                    return res.status(200).send({
                        data: {
                            min: minWP[0]?.price,
                            max: maxWP[0]?.price,
                        }
                    })
                case 'Kids':
                    const minKidsP = await Kids.find().sort({ price: 1 }).limit(1)
                    const maxKidsP = await Kids.find().sort({ price: -1 }).limit(1)
                    return res.status(200).send({
                        data: {
                            min: minKidsP[0]?.price,
                            max: maxKidsP[0]?.price,
                        }
                    })
                case 'Kitchen':
                    const minHP = await HomeKitchen.find().sort({ price: 1 }).limit(1)
                    const maxHP = await HomeKitchen.find().sort({ price: -1 }).limit(1)
                    return res.status(200).send({
                        data: {
                            min: minHP[0]?.price,
                            max: maxHP[0]?.price,
                        }
                    })


                case 'allVideo':
                    const minP = await ProUser.find().sort({ price: 1 }).limit(1)
                    const maxP = await ProUser.find().sort({ price: -1 }).limit(1)
                    return res.status(200).send({
                        data: {
                            min: minP[0]?.price,
                            max: maxP[0]?.price,
                        }
                    })



                default:
                    res.status(500).send({
                        message: 'There is no price'
                    });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Internal server error"
            })
        }
    },

    getFilterProduct: async (req, res) => {
        try {
            const { content, user, sortedBy, maxPrice, size, page } = req.query || {}
            console.log('query', req.query)
            switch (user) {
                case "Men":

                    productCount(Men, content, res)

                    const result = await Men.aggregate([
                        {
                            $match: {
                                $and: [
                                    { price: { "$lte": maxPrice } },
                                    { category: new RegExp(content, 'i') }
                                ]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }
                    ])
                    console.log('result', result)
                    // console.log(count)
                    return res.status(200).send({
                        result,
                        count
                    })

                case "Kids":
                    productCount(Kids, content, res)
                    const kidsResult = await Kids.aggregate([
                        {
                            $match: {
                                $and: [
                                    { price: { "$lte": maxPrice } },
                                    { category: new RegExp(content, 'i') }
                                ]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])

                    return res.status(200).send({
                        result: kidsResult,
                        count
                    })
                case "Women":
                    productCount(Women, content, res)
                    const womenResult = await Women.aggregate([
                        {
                            $match: {
                                $and: [
                                    { price: { "$lte": maxPrice } },
                                    { category: new RegExp(content, 'i') }
                                ]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])


                    return res.status(200).send({
                        result: womenResult,
                        count
                    })

                case "Home&Kitchen":
                    productCount(HomeKitchen, content, res)
                    const homeResult = await Women.aggregate([
                        {
                            $match: {
                                $and: [
                                    { price: { "$lte": maxPrice } },
                                    { category: new RegExp(content, 'i') }
                                ]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])

                    return res.status(200).send({
                        result: homeResult,
                        count
                    })
                case "allVideo":

                    productCount(ProUser)
                    const allProduct = await ProUser.aggregate([
                        {
                            $match: {
                                price: { $lte: maxPrice }
                            }
                        },
                        {
                            $sort: {
                                'createdAt': -1
                            },

                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size },


                    ])
                    // console.log(allProduct)
                    return res.status(200).send({
                        result: allProduct,
                        count
                    })

                default:
                    return res.send({
                        message: 'No video uploaded'
                    })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Server Error"
            })
        }
    },

    getSingleProduct: async (req, res) => {
        try {
            const { id } = req.params || {}

            const result = await ProUser.find({ _id: id }).populate('videoOwner', 'latitude longitude country phone ')

            res.status(200).send({
                message: "success",
                result
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error'
            })
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await ProUser.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a Product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    savedVideo: async (req, res) => {
        try {

            const { productId, userId } = req.query || {}
            const result = await ProUser.find({ _id: productId })
            const arrayResult = result[0]?.saved?.includes(userId)

            if (!arrayResult) {

                await ProUser.findOneAndUpdate({ _id: productId }, { $push: { "saved": userId } })
                await Users.findByIdAndUpdate({ _id: userId }, { $push: { "saveVideo": productId } })
                res.send({
                    message: "Success"
                })

            } else {

                res.send({
                    message: "User already present",
                    update: true
                })

            }
        } catch (error) {
            console.log(error)
        }
    },
    searchProduct: async (req, res) => {
        try {

            const data = await ProUser.find(
                {
                    "$or": [
                        { "category": { $regex: req.params.key } }
                    ]
                }
            )
            res.send(data)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { link, brand, type, category, price, Description } = req.body;
            if (!images) return res.status(400).json({ msg: "No image upload" })

            await ProUser.findOneAndUpdate({ _id: req.params.id }, {
                link, brand, type, category, price, Description
            })

            res.json({ msg: "Updated a Product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }




}


module.exports = productCtrl