/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res, next) {
        User.create(req.params.all(), function userCreated(err, user) {
            if (err) {
                req.session.flash = {
                    err: err
                };

                return res.redirect('/login');
            } else {
                user.online = true;
                user.save(function (err, user) {
                    if (err) return next(err);
                    req.session.authenticated = true;
                    User.publishCreate(user);
                    res.redirect("/");
                });
            }
        });
    },

    destroy: function (req, res, next) {

    },

    subscribe: function (req, res) {

        // Find all current users in the user model
        User.find(function foundUsers(err, users) {
            if (err) return next(err);

            // subscribe this socket to the User model classroom
            User.subscribe(req.socket);

            // subscribe this socket to the user instance rooms
            User.subscribe(req.socket, users);

            // This will avoid a warning from the socket for trying to render
            // html over the socket.
            res.send(200);
        });
    }
};