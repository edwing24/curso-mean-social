'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_surso_desarrollar_red_social_angular';

exports.createToken = function(user){
    var payload = {
        sub: user._id, //identificardo del documento
        name: user.name,
        surname:user.surname,
        nick:user.nick,
        email: user.email,
        rol:user.rol,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix()
    };

    return jwt.encode(payload,secret);
};