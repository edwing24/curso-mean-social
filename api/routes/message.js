'use strict'

var express = require('express');
var messageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-message',md_auth.ensureAuth,messageController.probando);
api.get('/message',md_auth.ensureAuth,messageController.saveMessage);
api.get('/my-messages/:page?',md_auth.ensureAuth,messageController.getReceiverMessages);
api.get('/messages/:page?',md_auth.ensureAuth,messageController.getEmmitMessages);
api.get('/unviewed-messages/',md_auth.ensureAuth,messageController.getUnviewedMessages);
api.get('/set-viewed-messages/',md_auth.ensureAuth,messageController.setViewedMessages);

module.exports = api;