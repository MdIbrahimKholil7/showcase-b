const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')

router.post('/register',userCtrl.register)

router.post('/login', userCtrl.login)

router.delete('/delete',userCtrl.deleteUser)

router.get('/find',userCtrl.findUser)
router.get('/getUser',auth,userCtrl.getUser)
router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth,  userCtrl.getUser)

// for valid user 
router.get('/validation',auth,userCtrl.validation)
router.get('/getpic',auth,userCtrl.getImage)

router.get('/getotp', auth,  userCtrl.getOTP)

// router.post('/checkotp', auth,  userCtrl.checkOTP)

router.patch('/personal',auth, userCtrl.About)

router.patch('/changePass',auth, userCtrl.updatePass)

router.patch('/address',auth, userCtrl.AddressUpdate)

router.patch('/compdetail',auth, userCtrl.complete)

router.patch('/editpro',auth, userCtrl.editprofile)

router.patch('/addcart', auth, userCtrl.addSaved)

router.get('/location', auth, userCtrl.Locations)


// router.post('/videopost',auth,authAdmin,user)

// router.get('/history', auth, userCtrl.history)


module.exports = router