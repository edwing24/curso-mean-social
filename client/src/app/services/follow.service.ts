import { Injectable } from '@angular/core'; // permite definir servicios e inyectarlos en cualquier otra clase
import { HttpClient, HttpHeaders } from '@angular/common/http'; // para peticiones ajax, enviar cabezera en las peticiones ajaz
import { Observable } from 'rxjs/Observable'; // recoger las respuestas que nos devuelve la api si marca error detener el servidor ctrl+c y poner npm install --save rxjs-compat luego volver a iniciar
import { Follow } from '../models/follow';
import { GLOBAL } from './global';

@Injectable()
export class FollowService{
    public url:string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addFollow(token,follow):Observable<any>{
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',token);

        return this._http.post(this.url+'follow',params, {headers: headers});
    }

    deleteFollow(token,id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                       .set('Authorization',token);

        return this._http.delete(this.url+'follow/'+id, {headers: headers});
    }


}