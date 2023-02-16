const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/user')

function initializePassport(passport) {
    /*
    const authenticateUser = async (username, email, password, done) => {
        const user = getUserByName(username)
        if (user == null) {
            return done(null, false, {message: "There is no user with that email."}); 
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, {message: "Password incorrect."})
            }
        } catch (e) {
            return done(e)
        }
    }*/

    const authenticateUser = (username, password, done) => {
        User.findOne({ username: username }, async (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: "There is no user with that email." })
            }
            try {
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
    //passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            const username = user.username;
            done(err, user, username);
        })
    })
}

module.exports = initializePassport; 