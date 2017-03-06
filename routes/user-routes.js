var router = require ('express').Router();
var mongoose = require ('mongoose');
var es6Promise = require ('es6-promise').Promise;

var UserSchema = require ('../schemas/UserSchema');
var config = require ('../data/config');

var User = mongoose.model ('users', UserSchema);

router.post ('/auth', (req, res) => {
    var data = req.body;

    if (data.username && data.password) {
        mongoose.Promise = es6Promise;
        mongoose.connect (config.host, config.db);

        User.findOne ({username: data.username}, (err, doc) => {
            if (err) res.send ({status: 'error', message: err});
            else if (doc) {
                if (doc.password == data.password ) {
                    if (req.ip == doc.machine) {
                        req.session.user = {
                            id: doc._id,
                            username: doc.username,
                            ip: doc.machine
                        };
                        res.send ({status: 'success', message: 'authenticated'});
                    } else
                        res.send ({status: 'error', message: 'require to login from your own machine'});
                } else
                    res.send ({status: 'error', message: 'password error'});

            } else
                res.send ({status: 'error', message: 'username error'});

            mongoose.disconnect();
        })
    } else
        res.send ({status: 'error', message: 'Username and password required'});
});

router.post ('/signup', (req, res) => {
    var data = req.body;
    data.addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (data.username && data.password) {
        mongoose.Promise = es6Promise;
        mongoose.connect (config.host, config.db);

        User.findOne ({machine: req.ip}, (err, doc) => {
            if (err) { 
                res.send ({status: 'error', message: err});
                mongoose.disconnect ();

            }
            else if (doc) {
                res.send ({status: 'error', message: 'This machine is already registered'});
                mongoose.disconnect ();
            } else {
                 User.findOne ({username: data.username}, (err, doc) => {
                    if (err) { 
                        res.send ({status: 'error', message: err});
                        mongoose.disconnect ();
                    } else if (doc) {
                        res.send ({status:'error', message: 'username already exists'});
                        mongoose.disconnect ();
                    } else {
                        var newUser = new User({
                            username: data.username,
                            password: data.password,
                            machine: data.addr
                        });

                        newUser.save().then (() => {
                            res.send ({status: 'success', message: 'user registered'});
                            mongoose.disconnect ();
                        });
                    }
                });
            }
        });
    } else
        res.send ({status: 'error', message: 'username and password required'});
});

// clear the session
router.get ('/logout', (req, res) => {
    if (req.session.user)
        req.session.user = undefined;
    res.send ({status: 'success'});
});

module.exports = router;
