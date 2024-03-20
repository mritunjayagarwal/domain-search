const { query } = require("express");
module.exports = function(passport){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup' , this.signup);
            router.get('/logout', this.logout);

            router.post('/create', this.createAccount);
            router.post('/login', this.getInside);
        },
        indexPage: async function(req, res){
                return res.render('index');
        },
        signup: function(req, res){
                return res.render('signup.ejs');
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }),
        getInside: passport.authenticate('local.login', {
            successRedirect: 'back',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
    }
}