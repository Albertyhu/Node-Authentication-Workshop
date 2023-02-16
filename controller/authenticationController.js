const User = require('../model/user')
const passport = require("passport");
const bcrypt = require('bcrypt');

/* The following block of code for authentication doesn't work. 
 * Authentication code has to be on app.js
 */
exports.RenderHome = (req, res, next) => {
    res.render('index', {
        user: req.user,
    })
}

exports.LogIn_Get = async (req, res, next) => {
    res.render('login-form')
}

exports.LogIn_Post =passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/log-in',
        failureFlash: true,
})

exports.SignUp_Get = (req, res, next) => {
    res.render('sign-up-form');
}

exports.SignUp_Post = async (req, res, next) => {
    try {
        //bcrypt has the purpose of securing the password by hashing and salting it
        //by encrypting it. It will 'salt' or in other words
        //add more random letters at the end of hashed password
        //The second argument in the bcrypt.hash function determines
        //how many letters you want to add to the end.
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var obj = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        }
        const newUser = new User(obj)
            .save((err) => {
                if (err) {
                    return next(err)
                }
                res.redirect('/',)
            })
    } catch (e) {
        console.log("Error in logging in: ", e.message)
        res.render('sign-up-form', {
            error: e,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
    }
}

exports.LogOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}