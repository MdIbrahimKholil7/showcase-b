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

router.route('/adminProductVideo')
    .get(auth,authAdmin,productCtrl.getAdminVideo)
router.route('/search/:key').get(productCtrl.searchProduct)



module.exports = router