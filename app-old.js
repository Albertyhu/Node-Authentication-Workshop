const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const createError  = require('http-errors')
const bcrypt = require('bcrypt')
const User = require('./model/user')
const flash = require('express-flash')
const initializePassport = require('./passport-config.js');
const {body, validationResult } = require('express-validator')

if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
} 

initializePassport(passport)

const mongoDb = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@locallibrarycluster.lyfvtsg.mongodb.net/AuthenticationWorkshop?retryWrites=true&w=majority`;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

//This is used for catching errors 
app.use(flash())

//secret is the encryption key used to encrypt the passwords 
//resave: Do we want to resave if nothing is changed?
//saveUninitialized: do we want to save an empty value.  
app.use(session({
    secret: `${process.env.ENCRYPT_KEY}`,
    resave: false,
    saveUninitialized: false, 
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

//Exporting the routes didn't work for the authentication system
//const indexRouter = require('./routes/indexRoute')
//app.use("/", indexRouter);


app.get('/', (req, res, next)=>{
    res.render('index', {
        user: req.user,
    })
})

app.get('/log-in', async (req, res, next)=>{
    res.render('login-form')
})

app.post('/log-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true, 
}))

app.get('/sign-up', (req, res, next)=>{
    res.render('sign-up-form')
})

app.post('/sign-up', async (req, res, next)=>{
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
        .save( err =>{
            if(err){
                return next(err)
            }
         res.redirect('/', )
        })
    }catch(e){
        console.log("Error in logging in: ", e.message)
        res.render('sign-up-form', {
            error: e,
            username: req.body.username,
            email: req.body.email, 
            password: hashedPassword, 
            })
    }
})

app.get('/log-out', (req, res, next)=>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
    });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.render("error", {
        title: "Error",
        error: err.message, 
    });
});

app.listen(3000, () => console.log("app listening on port 3000!"));