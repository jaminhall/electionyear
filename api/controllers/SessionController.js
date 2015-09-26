/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
    /*'signin': function (req, res) {
        res.view('session/new');
    },*/
    'destroy': function (req, res, next) {
        res.redirect("/login");
    },

    'create': function (req, res, next) {

        if (!req.param('username') || !req.param('password')) {
            var error = [{
                name: "usernamePasswordRequired",
                message: "Please enter a username and password."
            }];
            req.session.flash = {
                err: error
            }
        }
        User.findOne({
            username: req.param('username')
        }, function (err, user) {
            if (err) return next(err);

            if (!user) {
                var error = [{
                    name: 'noAccount',
                    message: "Username not found"
                }];
                req.session.flash = {
                    err: error
                }
                res.redirect('/login');
                return;
            }

            bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
                if (err) return next(err);

                // If the password from the form doesn't match the password from the database...
                if (!valid) {
                    var usernamePasswordMismatchError = [{
                        name: 'usernamePasswordMismatch',
                        message: 'Invalid username and password combination.'
					}]
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    }
                    res.redirect('/login');
                    return;
                }

                // Log user in
                req.session.authenticated = true;
                req.session.User = user;

                // Change status to online
                user.online = true;
                user.save(function (err, user) {
                    if (err) return next(err);

                    /*
                    // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
                    User.publishUpdate(user.id, {
                        loggedIn: true,
                        id: user.id,
                        name: user.name,
                        action: ' has logged in.'
                    });

                    // If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
                    // This is used in conjunction with config/policies.js file
                    if (req.session.User.admin) {
                        res.redirect('/user');
                        return;
                    }

                    //Redirect to their profile page (e.g. /views/user/show.ejs)
                    res.redirect('/user/show/' + user.id);
                    */
                    res.redirect('/');
                });
            });

        });

    }

};