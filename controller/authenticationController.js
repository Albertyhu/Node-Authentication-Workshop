const User = require('../model/user')
const passport = require("passport");

exports.SignUp_Get = (req, res, next) => {
    res.render('sign-up-form');
}

exports.SignUp_Post = (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    }).save((err, result) => {
        if (err) {
            return next(err)
        }

        const newUser = {
            username: result.username,
            password: result.password,
        }
        res.redirect('/'); 
    })
}

exports.LogIn_Get = (req, res, next) => {
    res.render('login-form')
}

exports.LogIn_Post = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
    next();
}

exports.LogOut = (req, res, next) => {
    req.logout(function (err) {
        if (err)
            return next(err)
        res.director("/")
    })
}