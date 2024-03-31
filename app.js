const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require('mongoose');
const http = require('http');
const fileUpload = require('express-fileupload');
const container = require('./container');
require('dotenv').config();

container.resolve(function(routes, domain, _){

    mongoose.Promise = global.Promise;

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Connected")
    })

    mongoose.connection.on("error", (err) => {
        console.log(err);
    });

    mongoose.connection.on("connected", (err, res) => {
        console.log("Database connection successful!");
    });

    const app = ShowExpress();

    function ShowExpress(){
        const app = express();
        const server = http.createServer(app);
        const port = 9000;

        configureExpress(app);

        server.listen(process.env.PORT || port, function(err){
            if(err) console.log(err);
            console.log("Gameplae! Lets Plae ");
        });

        const router = require('express-promise-router')();
        routes.SetRouting(router);
        domain.SetRouting(router);

        app.use(router);

        app.use(function(req, res){
            res.render('404');
        })

    }

    function configureExpress(app){

        require('./passport/signup');
        require('./passport/login');

        app.use(express.static('public'));
        app.use(express.json({
            verify: (req, res, buf) => {
                const url = req.originalUrl;
                if(url.startsWith('/success')){
                    req.rawBody = buf.toString()
                    console.log(req.rawBody);
                }
            }
        }))
        app.use(express.urlencoded({ extended: true}));
        app.use(cookieParser());
        app.use(session({
            secret: 'heylu',
            resave: true,
            saveUninitialized: true,
            cookie : {
                maxAge: 1000* 60 * 60 *24 * 365
            },
            store: MongoStore.create({mongoUrl: process.env.MONGODB_URI })
        }));

        app.use(flash());
        app.set('view engine', 'ejs');
        app.use(fileUpload());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }
})