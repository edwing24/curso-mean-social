'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_surso_desarrollar_red_social_angular';

exports.ensureAuth = function(req,res,next){ // el parametro next es para que ejecute el siguiente bloque de cogdigo en la cadena de ejecución
    if(!req.headers.authorization){ // es un parametro que recibo en mi cabezera
        return res.status(403).send({message: "la petición no tiene la cabezera de autenticación"});
    }

    var token = req.headers.authorization.replace(/['"']+/g,''); // reemplaza las comillas simples y dobles de cualquier parte del token recibido
    //var token = (!isNaN(req.headers.authorization)) ? req.headers.authorization.replace(/['"']+/g,'') : null;
    //console.log(token);

    try{
        var payload = jwt.decode(token,secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: "El token ha expirado"
            });
        }
    }
    catch(ex){
        return res.status(404).send({
            message: "El token no es válido"
        });
    }

    req.user = payload; // en los controladores podré trabajar con el usuario mediante este token

    next(); // ejecutar la acción del controlador
};