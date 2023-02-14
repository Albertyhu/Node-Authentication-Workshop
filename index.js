const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("dotenv").config();

const mongoDb = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@locallibrarycluster.lyfvtsg.mongodb.net/AuthenticationWorkshop?retryWrites=true&w=majority`;
//const mongoDb = `mongodb+srv://AuthenticationUser:mbM5HbC9ERmcMY7@locallibrarycluster.lyfvtsg.mongodb.net/AuthenticationWorkshop?retryWrites=true&w=majority`;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


const indexRouter = require('./routes/indexRoute')

const app = express();
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
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