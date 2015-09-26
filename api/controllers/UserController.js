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
                req.session.authenticated = true;
                res.redirect("/");
            }
        });
    }
};