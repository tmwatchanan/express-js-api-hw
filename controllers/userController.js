var config = require('../config');

var mongoose = require('mongoose');
var User = require('../models/User'); // Import User model.
var hash = require('../hash'); // import salt and hash functions
var jwt = require('jsonwebtoken');

exports.getUsers = function (req, res) {
    User.find((err, users) => { // Define what to do
        if (err) throw err; // when query finished.
        res.json(users); // Using respond obj to
    }); // return users as JSON.
};

exports.getUserById = function (req, res) {
    User.find({
        id: req.params.id
    }, (err, user) => { // req.params.id = 101
        if (err) throw err;
        if (user && user.length != 0) // check a user is found
            res.json(user);
        else
            res.status(404).json({ // if not found, return
                success: false, // an error message
                message: 'user not found!'
            });
    });
};

exports.getUserByOId = function (req, res) {
    User.findById(req.params._id, (err, user) => {
        if (err) throw err;
        if (user && user.length != 0) // check a user is found
            res.json(user);
        else
            res.status(404).json({ // if not found, return
                success: false, // an error message
                message: 'user not found!'
            });
    });
};


exports.addNewUser = function (req, res) {
    var salt = hash.genRandomString(16);
    var pwd_data = hash.sha512(req.body.password, salt);
    // find a user with maximum id: find all users and sort by id max-to-min
    User.find({}).sort({
        id: -1
    }).limit(1).exec((err, users) => {
        if (err) throw err;
        if (users && users.length != 0) {
            var newUser = new User({
                id: users[0].id + 1, // users is an array of User objects
                name: req.body.name,
                age: parseInt(req.body.age),
                email: req.body.email,
                salt: pwd_data.salt,
                passwordhash: pwd_data.passwordHash,
                admin: req.body.admin ? req.body.admin : false
            });
            newUser.save(function (err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to add new user!',
                    });
                } else {
                    return res.json({
                        success: true,
                        message: 'New user has been created',
                        user: {
                            name: newUser.name,
                            email: newUser.email,
                            admin: newUser.admin
                        }
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: 'User cannot be added!'
            });
        }
    });
};

exports.login = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            var passwdData = hash.sha512(req.body.password, user.salt);
            if (user.passwordhash != passwdData.passwordHash) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                const payload = {
                    id: user.id,
                    email: user.email,
                    admin: user.admin
                };
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                return res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        } // end of else if(user)
    }); // end of the callback function
};

exports.editUserById = function (req, res) {
    User.find({
        id: req.params.id
    }).update(req.body, (err) => { // req.params.id = 101
        // if (err) throw err;
        if (err) {
            let errorMessage = 'Unable to UPDATE the user id:' + req.params.id;
            return res.json({
                success: false,
                message: errorMessage,
            });
        } else {
            let successfulMessage = 'The user id:' + req.params.id + ' has been UPDATED';
            return res.json({
                success: true,
                message: successfulMessage
            });
        }
    });
};

exports.deleteUserById = function (req, res) {
    User.find({
        id: req.params.id
    }).remove((err) => { // req.params.id = 101
        // if (err) throw err;
        if (err) {
            let errorMessage = 'Unable to DELETE the user id:' + req.params.id;
            return res.json({
                success: false,
                message: errorMessage,
            });
        } else {
            let successfulMessage = 'The user id:' + req.params.id + ' has been deleted';
            return res.json({
                success: true,
                message: successfulMessage
            });
        }
    });
};