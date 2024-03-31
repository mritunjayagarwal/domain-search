const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    username: { type: String, lowercase: true, required: true},
    password: { type: String, required: true},
    email: { type: String, lowercase: true, required: true},
    fname: {type: String},
    lname: {type: String},
    phone: {type: Number},
    address: {type: String},
    organisation: {type: String},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    zip: {type: Number},
    domains: [
        {
            type: String
        }
    ]
});

UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

UserSchema.methods.compare = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);