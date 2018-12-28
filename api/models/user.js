'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname:String,
    email: String,
    nick: String,
    password : String,
    role: String,
    image: String
});

module.exports = mongoose.model('User',UserSchema); // se pone user porque cuando se guarda se pone lower y se pone "users"