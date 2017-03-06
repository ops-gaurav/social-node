var Schema = require ('mongoose').Schema;

var ChatSchema = new Schema ({
    _user: {type: Schema.Types.ObjectId, ref: "users"},
    message: String,
    time: Number
});

module.exports = ChatSchema;