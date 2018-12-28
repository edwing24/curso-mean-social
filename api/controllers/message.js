'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req,res){
    res.status(200).send({message:'Hola desde message'});
}

function saveMessage(req,res){
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message:'Envía los datos necesarios'});

    var message = new Message();
    message.emmiter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err,messageStored)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});

        if(!messageStored) return res.status(404).send({message:'Error al enviar el mensaje'});

        return res.status(200).send({message:messageStored});
    });
}

function getReceiverMessages(req,res){
    var userId = req.user.sub;

    var page=1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({receiver:userId}).populate('emitter','name surname _id nick image').paginate(page,itemsPerPage,(err,messages,total)=>{ //como segundo parametro de populate pongo los campos que quiero que se muestren
        if(err) return res.status(200).send({message:'Error en la petición'});

        if(!messages) return res.status(404).send({message:'No hay mensajes'});

        return res.status(200).send({
           total: total,
           pages: Math.ceil(total/itemsPerPage),
           messages:messages 
        });
    });
}

function getEmmitMessages(req,res){
    var userId = req.user.sub;

    var page=1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({user:userId}).populate('emitter receiver','name surname _id nick image').paginate(page,itemsPerPage,(err,messages,total)=>{ //como segundo parametro de populate pongo los campos que quiero que se muestren
        if(err) return res.status(200).send({message:'Error en la petición'});

        if(!messages) return res.status(404).send({message:'No hay mensajes'});

        return res.status(200).send({
           total: total,
           pages: Math.ceil(total/itemsPerPage),
           messages:messages 
        });
    });
}

function getUnviewedMessages(req,res){
    var userId = req.user.sub;

    Message.count({receiver:userId, viewed:'false'}).exec((err,count)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});

        return res.status(200).send({'unviewed':count});
    });
}

function setViewedMessages(req,res){
    var userId = req.user.id;

    Message.update({receiver:userId,viewed:'false'},{viewed:'true'},{'multi':true},(err,messagesUpdated)=>{ //{receiver:userId,viewed:'false'} (estas son las condiciones que busque los recibidos y que no hayan sido vistos),{viewed:'true'} (aqui pone que valor le vamos a poner a lo buscado),{'multi':true} (esto indica que actualice multiple cantidad de registros)
        if(err) return res.status(500).send({message:'Error en la petición'});

        return res.status(200).send({messages: messagesUpdated});
    });
}

module.exports = {
    probando,
    saveMessage,
    getReceiverMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}