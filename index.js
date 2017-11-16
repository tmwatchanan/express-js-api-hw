// app.js – entry point for Node.js application
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var users = require('./data/users');

/* Body Parser Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
/* Path for static content: Angular, Vue.js, html, js, css */
// Create ‘index.html’ file inside the ‘public’ directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
    console.log('Server Started on Port 3000…');
});

app.get('/', function(req, res) {
    res.send('Hello World..');
});

app.get('/users', function(req, res) {
    res.json(users);
});