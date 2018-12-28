'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); // para tener acceso a metodos get,post,put,delete etc

var md_auth = require('../middlewares/authenticated'); //md_auth = middleware_authentication

var multipart = require('connect-multiparty'); //para las iamgenes de subida

var md_upload = multipart({uploadDir: './uploads/users'});


api.get('/home',md_auth.ensureAuth,UserController.home);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id',md_auth.ensureAuth,md_upload,UserController.uploadImage); // aqui se usa md_upload
api.get('/get-image-user/:imageFile',UserController.getImageFile);
api.get('/counters/:id?',md_auth.ensureAuth,UserController.getCounter);

module.exports = api;
