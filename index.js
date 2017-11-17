var express = require('express');
var app = express();

var bodyParser = require('body-parser'); // handling HTML body
var morgan = require('morgan'); // logging
var mongoose = require('mongoose'); // Mongodb library
var jwt = require('jsonwebtoken'); // token authentication

var config = require('./config'); // global config
var hash = require('./hash'); // passwd hashing module

var port = process.env.PORT || config.port // load port config
var hostname = config.hostname; // load hostname config

// mongoose.createConnection(config.database); // setup mongoose, use createConnection instead of connect
//Set up default mongoose connection
var mongoDB = config.database;
mongoose.connect(mongoDB, {
    useMongoClient: true
});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// use body parser so we can get info from POST and/or URL params
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// import functions defined as User’s controller
var Users = require('./controllers/userController.js');
var User = require('./models/User');

/* handle GET request */
app.get('/', function (req, res) {
    User.find((err, people) => { // Define what to do
        if (err) throw err; // when query finished.
        res.render('index', { // passing params
            title: 'Customer List',
            users: people
        });
    });
});

// app.get('/', function (req, res) {
//     res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

app.listen(port, hostname, () => {
    console.log('Simple API started at http://localhost:' + port);
});

app.post('/login', function (req, res) {
    Users.login(req, res);
});

app.post('/user', function (req, res) {
    Users.addNewUser(req, res);
});

app.use(function (req, res, next) {
    // code for token verification – continue on next slides
    // if token is valid, continue to the specified sensitive route
    // if token is NOT valid, return error message

    // read a token from body or urlencoded or header (key = x-access-token)
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Invalid token.'
                });
            } else {
                req.decoded = decoded; // add decoded token to request obj.
                next(); // continue to the sensitive route
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

app.get('/user', function (req, res) {
    Users.getUsers(req, res);
});

app.get('/user/oid/:_id', function (req, res) {
    Users.getUserByOId(req, res);
});

app.get('/user/:id', function (req, res) {
    Users.getUserById(req, res); // passing request and respond objs.
});

app.put('/user/:id', function (req, res) {
    Users.editUserById(req, res);
});

app.delete('/user/:id', function (req, res) {
    Users.deleteUserById(req, res);
});