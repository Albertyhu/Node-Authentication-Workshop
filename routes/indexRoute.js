const express = require('express'); 
const router = express.Router(); 
const AuthenticationController = require('../controller/authenticationController')

router.get('/', (req, res, next) => {
    res.render('index', {user: req.user})
})

router.post('/', AuthenticationController.LogIn_Post)

router.get('/sign-up', AuthenticationController.SignUp_Get)

router.post('/sign-up', AuthenticationController.SignUp_Post)

router.get('/log-in', AuthenticationController.LogIn_Get)
router.post('/log-in', AuthenticationController.LogIn_Post)

router.get('/log-out', AuthenticationController.LogOut)
module.exports = router; 