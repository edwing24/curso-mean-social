'use strict'

var mongoose = require('mongoose'); // al ser pquete se pone asi
var app = require('./app'); // al ser fichero se pone asi (app.js)
var port = 3800;

//conexion a base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useMongoClient:true})
.then(()=>{
    console.log('La conexion a bd se realizo correctamente');

    //crear servidor
    app.listen(port,()=>{
        console.log("Servidor corriendo en http://localhost:3800");
    });
})
.catch(err=>console.log(err));