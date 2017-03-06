var router = require ('express').Router();
var mongoose = require ('mongoose');
var es6Promise = require ('es6-promise').Promise;

var ChatSchema = require ('../schemas/ChatSchema');
var config = require ('../data/config');

var Chat = mongoose.model ('chats', ChatSchema);

router.get ('/', (req, res) => {
    if (req.session.user) {
        mongoose.Promise = es6Promise;
        mongoose.connect (config.host, config.db);
        Chat.find ({}, (err, data) => {
            if (err) res.send ({status: 'error', message: err});
            else if (data && data.length > 0) {
                res.send (data);
            } else
                res.send ({status: 'alert', message: 'no chats'});
            
            mongoose.disconnect ();
        });
    }
});

router.post ('/message', (req, res) => {
    if (req.session.user) {
        if (req.body.message) {
            mongoose.Promise = es6Promise;
            mongoose.connect (config.host, config.db);
            var message = new Chat({
                _user: req.session.user.username,
                message: req.body.message,
                time: new Date().getTime()
            });

            message.save().then (() => {
                res.send ({status: 'success', message: 'message pushed'});
                mongoose.disconnect();
            });
        } else
            res.send ({status:'error', message: 'cannot send empty message'});
    } else
        res.send ({status: 'error', message: 'login first'});
});
