const router = require('express').Router()
const productCtrl = require('../controllers/proCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(auth, authAdmin, productCtrl.createProduct)

router.route('/products/:id')
    .delete(auth, authAdmin, productCtrl.deleteProduct)
    .patch(auth, authAdmin, productCtrl.updateProduct)
router.post('/save', productCtrl.savedVideo)
// get single product 
router.get('/get-single-product/:id', auth, productCtrl.getSingleProduct)

router.route('/adminProductVideo')
    .get(auth, authAdmin, productCtrl.getAdminVideo)
router.route('/search/:key').get(productCtrl.searchProduct)
router.get('/min-max-price', productCtrl.getMinPrice)
router.get('/best-seller-video',productCtrl.bestSellerVideo)
router.get('/get-product', productCtrl.getFilterProduct)
router.get('/get-latest-video',productCtrl.getLatestVideo)
module.exports = router
