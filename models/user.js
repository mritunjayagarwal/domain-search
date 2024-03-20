const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    username: { type: String, lowercase: true, required: true},
    password: { type: String, required: true},
    email: { type: String, lowercase: true, required: true},
    domains: [
        {
            type: String, unique: true
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