import { Injectable } from '@angular/core'; // permite definir servicios e inyectarlos en cualquier otra clase
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para peticiones ajax, enviar cabezera en las peticiones ajaz
import { Observable } from 'rxjs/Observable'; // recoger las respuestas que nos devuelve la api si marca error detener el servidor ctrl+c y poner npm install --save rxjs-compat luego volver a iniciar
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;
    public stats = {};

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    register(user:User): Observable<any>{//user_to_register){
        //console.log(this.url);
        //console.log('antes de guardar al usuario ' + user);
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.post(this.url+'register',params,{headers:headers});
    }

    singUp(user:User,gettoken=null):Observable<any>{
        if(gettoken!=null){
            //user.gettoken = gettoken; marcar error por que gettoken no lo tineen user. una solucion es poner user:any
            user = Object.assign(user,{gettoken}); // se le asigna una nueva propiedad a mi objeto user
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.post(this.url+'login',params,{headers:headers});

    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity!="undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    gettoken(){
        let token = localStorage.getItem('token');
        if(token!="undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

    getStats(){
        console.log("entrando al metodo getstats");
        let stats = JSON.parse(localStorage.getItem('stats'));
        console.log("esto trae stats: " + stats);


        if(stats!="undefined"){
            this.stats = stats;
        }else{
            this.stats = null;
        }

        return this.stats;
    }

    getCounters(userId = null): Observable<any>{
        console.log("entrando al metodo getCounters de user.service.ts")
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',this.gettoken());

        if(userId!=null){
            return this._http.get(this.url+'counters/'+userId,{headers:headers});
        }else{
            return this._http.get(this.url+'counters',{headers:headers});
        }
    }

    updateUser(user:User):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',this.gettoken());
        
        return this._http.put(this.url+'update-user/'+user._id,params,{headers:headers});
    }

    getUsers(page=null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',this.gettoken());

        return this._http.get(this.url+'users/'+page, {headers:headers});
    }

    getUser(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',this.gettoken());

        return this._http.get(this.url+'user/'+id, {headers:headers});
    }






}