var Schema = require ('mongoose').Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    machine: String
});
module.exports = UserSchema;