'use strict'

var User = require('../models/user'); // no es necesario poner el ".js"
var Follow = require('../models/follow')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var monngosePagination = require('mongoose-pagination');
var fs = require('fs'); // de node para trabajar con ficheros
var path = require('path');
var Publication = require('../models/publication');



function home(req,res){
    res.status(200).send({
        message: "Hola mundo"
    });
}

function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick,
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;

        //Controlar usuarios duplicados
        User.find({ $or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err,users)=>{
            if(err) return res.status(500).send({message:"Error en la petición de usuarios"});

            if(users && users.length>=1){
                return res.status(200).send({message:"El usuario que intentas registrar ya existe"});
            }
            else{
                //crifrar contraseña y guardar datos
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    //if(err) return res.status(500).send({message:"Error al guardar el usuario hash"});
                    user.password = hash;
        
                    user.save((err,userStored)=>{ //save es un metodo nativo de mongoose
                        if(err) return res.status(500).send({message:"Error al guardar el usuario"});
                        
                        if(userStored){
                            res.status(200).send({user:userStored});
                        }
                        else{
                            res.status(404).send({message: "No se ha registrado el usuario"});
                        }
                    });
                });
            }
        });
    }
    else{
        res.status(200).send({message:"Ingrese todos los datos!!!"});
    }
}

function loginUser(req,res){
    var params = req.body;
    var user = new User();

    var email = params.email;
    var password = params.password;

    User.findOne({email:email},(err,user)=>{
if(err) return res.status(404).send("El usuario no se pudo identificar");

        if(user){
            bcrypt.compare(password,user.password,(err,check)=>{
                if(check){
                    if(params.gettoken){
                        //generar y devolver token
                        return res.status(200).send({token: jwt.createToken(user)
                        });
                    }
                    else{
                    //devolver datos del usuario
                    user.password = undefined; //para no devolver la contraseña del usuario
                    return res.status(200).send({user});
                    }
                }
                else{
                    return res.status(404).send("El usuario no se pudo identificar");
                }
            });
        }
        else{
            res.status(404).send("El usuario no pudo identificarse");
        }
    });
}

//conseguir los datos del usuario
function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId,(err,user)=>{
        if(err) return res.status(500).send("Hubo un error en la petición");

        if(!user) return res.status(404).send("El usuario no fue encontrador");

        //userId = usuario consultado por la url
        //req.user.sub = usuario autenticado (osea yo)
        followThisUser(req.user.sub,userId).then((value)=>{
            user.password = undefined; //ya no me devuelve esta propiedad en mi JSON
            return res.status(200).send({user,
                                         following: value.following, // si solo pongo value (tanto following como followed se me ponen en un nivel menos que user)
                                         followed: value.followed}); //poniendo de esta forma following y followed estan los 3 al mismo nivel
        });

        //return res.status(200).send({user});
    });
}

//creamos una función asincrona para poder asignar valores de los que seguimos y loos que no siguen
//si lo ponemos dentro del mismo metodo de getuser entonces no nos tomara ningun valor aunque esten 
//dentro de call backs anidados
async function followThisUser(identity_user_id, user_id){ //identity_user_id es el usuario autenticado (yo), user_id es el usuario por la url
    //following es si yo sigo a este usuario (siguiendo)
    try{
        var following = await Follow.findOne({'user':identity_user_id,'followed':user_id}).exec()
        .then((follow)=>{
            return follow;
        })
        .catch((err)=>{
            return handleError(err);
        });

        //si este usuario me sigue a mi
        var followed = await Follow.findOne({'user':user_id,'followed':identity_user_id}).exec()
        .then((follow)=>{
            return follow;
        })
        .catch((err)=>{
            return handleError(err);
        });
        

        return {
            following:following,
            followed:followed
        }
        }catch(e){
            console.log(e);
        }

}


function getUsers(req,res){
    var identity_user_id = req.user.sub;

console.log("id del usuario (getUsers): " +identity_user_id);

    var page = 1; //valor por defecto

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message: "Hubo un error en la ejecución"});

        if(!users) return res.status(404).send({message: "El usuario no fue encontrado"});

        //console.log("si trajo datos el usuarios")

        followUsersId(identity_user_id).then((value)=>{

            return res.status(200).send({
                users,
                users_following:value.following,
                user_follow_me:value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });

        });
    });
}

async function followUsersId(user_id){
    try{
    var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec() 
    .then((follows) => {
        return follows;
    })
    .catch((err)=>{
    return handleError(err)
    });
    
      var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec()
      .then((follows)=>{
      return follows;
      })
      .catch((err)=>{
      return handleError(err)
      });
                
            //Procesar following Ids
                var following_clean = [];
          
                following.forEach((follow) => {
                  following_clean.push(follow.followed);
                });
     
                //Procesar followed Ids
                var followed_clean = [];
            
                followed.forEach((follow) => {
                  followed_clean.push(follow.user);
                });


                console.log("el following: "+following.length);

                
          
            return {
                     following: following_clean,
                     followed: followed_clean
                   }
          
          } catch(e){
          console.log(e);
          }
    }

//devuelve el contador de quien nos sigue, cuanta gente estamos siguiendo (publicaciones)
function getCounter(req,res){
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }

    getCountFollow(userId).then((value)=>{
        return res.status(200).send(value);
    });
}

async function getCountFollow(user_id){
    console.log("entro a getcountfollow");
    console.log("el valor de userId es: " + user_id)


    var following = await Follow.count({'user': user_id}, function(err,count){
        if(err) return handleError(err);

        return count;
    });

    var followed = await Follow.count({'followed': user_id}, function(err,count){
        if(err) return handleError(err);

        return count;
    });

    var publications = await Publication.count({'user': user_id}, function(err,count){
        if(err) return handleError(err);

        return count;
    });


    return {
        following: following,
        followed:followed,
        publications:publications
    }
}

function updateUser(req,res){

    var userId = req.params.id;
    var update = req.body;

    //borrar la propiedad password
    delete update.password;

    if(userId!=req.user.sub){
        return res.status(500).send('No tienes permisos para actualizar los datos');
    }

    console.log("metodo updateUser de api");
    console.log("UserId: " + userId);
    console.log("req.user.sub: " + req.user.sub);

    User.find({ $or:[
                 {email: update.email.toLowerCase()},
                 {nick: update.nick.toLowerCase()}
    ]}).exec((err,users)=>{
        var user_isset = false;

        users.forEach((user)=>{
            if(user && user._id != userId) //res.status(500)({message:'Los datos ya estan en uso'});
            {
                user_isset = true;
            }
        });

        if(user_isset) return res.status(404).send({message:'Los datos ya estan en uso'});
        //se pone {new:true} para traer el registro modificado, sino se pone se trae el no modificado
        User.findByIdAndUpdate(userId,update, {new:true},(err,userUpdated)=>{
            if(err) return res.status(500).send({message:"Error en la petición"});

            if(!userUpdated) return res.status(404).send({messsage:'No se ha podido actualizar el usuario'});

            return res.status(200).send({user: userUpdated});
        });
    });
}

//subir archivos de imagen/avatar de usuario
function uploadImage(req,res){
    var userId = req.params.id;
    var update = req.body;

    //borrar la propiedad password
    delete update.password;

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; //para tomar el nombre uploads/users/imagen.jpg
        var ext_split = file_name.split('\.'); 
        var file_ext = ext_split[1]; //imagen.jpg

        if(userId != req.user.sub){
            return removeFileOfUploads(res,file,'No tienes permiso para actualizar los datos');
        }
        console.log('extension del archivo subido .' + file_ext);
        if(file_ext=='png' || file_ext=='jpg' || file_ext == 'jpeg' || file_ext=='gif'){
            console.log('entre al if ')

            console.log("el userid es: " + userId);
            //actualizar doucumento de usuario logueado
            User.findOneAndUpdate({"_id":userId},{image: file_name},{new:true},(err,userUpdated)=>{
                if(err) return res.status(500).send({message:"Error en la petición"});

                if(!userUpdated) return res.status(404).send({messsage:'No se ha podido actualizar el usuario'});
        
                console.log("El userupdated es: " + userUpdated);

                return res.status(200).send({user: userUpdated});
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
    var path_file = './uploads/users/' + image_file;
    
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }
        else{
            res.status(200).send('No existe la imagen');
        }
    });
}


module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounter
}
