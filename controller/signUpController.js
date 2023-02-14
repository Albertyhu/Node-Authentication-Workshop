const User = require('../model/user')

exports.SignUp_Get = (req, res, next) => {
    res.render('sign-up-form');
}

exports.SignUp_Post = (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    }).save(err => {
        if (err) {
            return next(err)
        }
        res.redirect('/'); 
    })
}
