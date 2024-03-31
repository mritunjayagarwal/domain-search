const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        console.log("reached")
        if(err){
            console.log(err);
            return done(null, false, req.flash('error', 'Weak Connectivity'));
        }

        if(user){
            return done(null, false, req.flash('error', 'User already exists'));
        }

        console.log("Here");
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        
        newUser.save(function(err){
            if(err) console.log(err);
            return done(null, newUser);
        });
    })
}));

