const express = require('express'); 
const router = express.Router(); 
const SignUpController = require('../controller/signUpController')

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/sign-up', SignUpController.SignUp_Get)

router.post('/sign-up', SignUpController.SignUp_Post)

module.exports = router; 