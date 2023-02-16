const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/user')

function initializePassport(passport) {
    const authenticateUser = (username, password, done) => {
        User.findOne({ username: username }, async (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: "There is no user with that email." })
            }
            try {
                //bcrypt is used to decrypt and compare the hashed password with the entered password
                if (await bcrypt.compare(password, user.password)) {
                    const username = user.username;
                    return done(null, user, username)
                }
                else {
                    return done(null, false, { message: "Password incorrect." })
                }
            } catch (e) {
                return done(e)
            }
        })
    }

    //LocalStrategy is used to authenticate users
    //Passport comes with many options to authenticate users
    //The most basic is username and password which is called LocalStrategy 
    passport.use(new LocalStrategy(authenticateUser))

    //This following block of code allows the user to stay logged in as they move around the app
    //These functions are not called directly. Instead, they are used in the
    //background by passport 
    passport.serializeUser((user, done) => done(null, user.id))
    //DeserializeUser makes sure that the user is logged in even if he
    //exits and enters the website again. 
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            const username = user.username;
            done(err, user, username);
        })
    })
}

module.exports = initializePassport; 