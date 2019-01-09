'use strict' //ecma sxript 6

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req,res){
    res.status(200).send({message:'hola desde controlador de publicaciones'});
}

function savePublication(req,res){
    var params = req.body;

    if(!params.text) return res.status(500).send({message:'Debe enviar un texto!!'});

    var publication = new Publication();

    publication.text = params.text;
    publication.file = null;//params.file;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err,publicationStored)=>{
        if(err) return res.status(500).send({message:'Error al guardar la publicación'});

        if(!publicationStored) return res.status(404).send({message:'La publicación no ha sido guardada'});

        return res.status(200).send({publication:publicationStored});
    });
}

function getPublications(req,res){
    var page=1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage=4;

    Follow.find({user:req.user.sub}).populate('followed').exec((err,follows)=>{
        if(err) return res.status(500).send({message:'Error al guardar el seguimiento'});

        var follows_clean=[];

        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        //esta linea sirve para agregar igual nuestro usuario para que busque publicaciones nuestras en el .find
        follows_clean.push(req.user.sub);

    //'$in' nos sirve para que se busque dentro de un json de datos
    Publication.find({user:{'$in':follows_clean}}).sort('-created_at').populate('user').paginate(page,itemsPerPage,(err,publications,total)=>{
        if(err) return res.status(500).send({message:'Error al devolver publicaciones'});

        if(!publications) return res.status(404).send({message:'no hay publicaciones'});

        return res.status(200).send({
            total_items:total,
            publications,
            pages: Math.ceil(total/itemsPerPage),
            page:page,
            items_per_page:itemsPerPage
        });
    });
    });
}

function getPublicationsUser(req,res){
    var page=1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage=4;

    var user = req.user.sub;
    if(req.params.user){
        user = req.params.user
    }

    //'$in' nos sirve para que se busque dentro de un json de datos
    Publication.find({user:user }).sort('-created_at').populate('user').paginate(page,itemsPerPage,(err,publications,total)=>{
        if(err) return res.status(500).send({message:'Error al devolver publicaciones'});

        if(!publications) return res.status(404).send({message:'no hay publicaciones'});

        return res.status(200).send({
            total_items:total,
            publications,
            pages: Math.ceil(total/itemsPerPage),
            page:page,
            items_per_page:itemsPerPage
        });
    });
}

function getPublication(req,res){
    var publicationId = req.params.id;

    Publication.findById(publicationId,(err,publication)=>{
        if(err) return res.status(500).send({message:'Error al devolver la publicación'});

        if(!publication) return res.status(404).send({message:'No existe la publicación'});

        return res.status(200).send({publication});
    });
}

function deletePublication(req,res){
    var publicationId = req.params.id;


    Publication.find({'user':req.user.sub,'_id':publicationId}).remove(err =>{
        if(err) return res.status(500).send({message:'Error al borrar la publicación'});

        //if(!publicationRemoved) return res.status(404).send({message:'No se ha borrado la publicación'});

        return res.status(200).send({message:'Publicación eliminada correctamente'});
    });
}

//subir archivos de imagen/avatar de usuario
function uploadImage(req,res){
    var publicationId = req.params.id;
    var update = req.body;

    //borrar la propiedad password
    delete update.password;

    if(req.files){
        var file_path = req.files.image.path;
        console.log("var_file_path: "+ file_path);
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; //para tomar el nombre uploads/users/imagen.jpg
        var ext_split = file_name.split('\.'); 
        var file_ext = ext_split[1]; //imagen.jpg
        console.log("var file_ext: "+ file_ext);

        if(file_ext=='png' || file_ext=='jpg' || file_ext == 'jpeg' || file_ext=='gif'){
            console.log("Actualizar imagen: req.user.sub=: " + req.user.sub);
            console.log("Actualizar imagen: publicationId=: " + publicationId);
            Publication.findOne({'user':req.user.sub,'_id':publicationId}).exec((err,publication)=>{
                if(publication)
                {
                    //actualizar doucumento de publicacion
                    Publication.findOneAndUpdate({"_id":publicationId},{file: file_name},{new:true},(err,publicationUpdated)=>{
                        if(err) return res.status(500).send({message:"Error en la petición"});

                        if(!publicationUpdated) return res.status(404).send({messsage:'No se ha podido actualizar la iamgen de la publicación'});
                
                        console.log("resultado a devolver: " + publicationUpdated);
                        return res.status(200).send({publication: publicationUpdated});
                    });
                }else{
                    return removeFileOfUploads(res,file_path,'No tiene permisos para actualizar esta publicación');
                }
            });

        }
        else{
            return removeFileOfUploads(res,file_path,'Extensión no valida');
        }
    }
    else{
        return res.status(200).send({message:'No se han subido imagenes'});
    }
}

function removeFileOfUploads(res,file_path,message){
    fs.unlink(file_path,(err)=>{
        return res.status(200).send({message: message});
    }); //eliminar archivo subido
};

function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;
    
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }
        else{
            res.status(200).send('No existe la imagen');
        }
    });
}

module.exports={
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser
}
