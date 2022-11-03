const { response } = require('express');
const ProUser = require('../models/productModel')
const Women = require('../models/womenProModel')
const Kids = require('../models/kidsProModel')
const Men = require('../models/menProModel')
const HomeKitchen = require('../models/home-kitchenProModel')
const { ObjectId } = require('mongodb')
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
    const { link, companyName, email, productBrand, productType, category, price, description, userId, discount } = data?.data || {};
    console.log('data', data?.video)
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
        userId: data?.userId
    })
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
        userId: data?.userId
    })
    const itemResult = await newItem.save()
    const result = await newProduct.save()
    console.log('result', result)
    res.json({ msg: "Created a product", result })
}



const productCount = async (collection, content, res) => {
    const results = collection.find({ category: new RegExp(content, 'i') })
    count = await results.count()

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
            const results = ProUser.find({ userId: req?.user?.id })
            const result = await results
            console.log('admin video', result)
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

            switch (content) {

                case 'Men':
                    const min = await Men.find().sort({ price: 1 }).limit(1)
                    const max = await Men.find().sort({ price: -1 }).limit(1)
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

                default:
                    break;
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

            switch (user) {
                case "Men":

                    productCount(Men, content, res)
                    console.log('from count', count)
                    const result = await Men.aggregate([
                        {
                            $match: {
                                category: new RegExp(content, 'i'),
                                $or: [{ price: { "$lte": maxPrice } }]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])


                    return res.status(200).send({
                        result,
                        count
                    })

                case "Kids":
                    productCount(Kids, content, res)
                    const kidsResult = await Kids.aggregate([
                        {
                            $match: {
                                category: new RegExp(content, 'i'),
                                $or: [{ price: { "$lte": maxPrice } }]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])


                    return res.status(200).send({
                        kidsResult,
                        count
                    })
                case "Women":
                    productCount(Women, content, res)
                    const womenResult = await Women.aggregate([
                        {
                            $match: {
                                category: new RegExp(content, 'i'),
                                $or: [{ price: { "$lte": maxPrice } }]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])


                    return res.status(200).send({
                        womenResult,
                        count
                    })

                case "Home&Kitchen":
                    productCount(HomeKitchen, content, res)
                    const homeResult = await Women.aggregate([
                        {
                            $match: {
                                category: new RegExp(content, 'i'),
                                $or: [{ price: { "$lte": maxPrice } }]
                            },
                        },
                        { $sort: { price: +sortedBy } },
                        { $skip: (+size) * (+page) },
                        { $limit: +size }

                    ])

                    return res.status(200).send({
                        homeResult,
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
            console.log(id)
            const result = await ProUser.aggregate([
                { $match: { _id: ObjectId('635f629747530d8dbcd4ddfd') } },
                {
                    $project: {
                        companyName: 1,
                        email: 1,
                        brand: 1,
                        type: 1,
                        category: 1,
                        price: 1,
                        Description: 1,
                        userId: {"$toObjectId": "user_id"},
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'userId',
                        foreignField:'_id',
                        as:'userDetails'
                    }
                }
            ])

            console.log(result)
            res.status(200).send({
                message: "success",
                result
            })
            console.log(result)
        } catch (error) {
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