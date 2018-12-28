import {Injectable, Inject} from '@angular/core';
import {GLOBAL} from './global';
import { promise } from 'protractor';
import { resolve } from 'path';
import { reject } from 'q';

@Injectable()
export class UploadService{
    public url: string;

    constructor(){
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){
        return new Promise(function(resolve, reject){
            var formData = new FormData;

            var xhr = new XMLHttpRequest();

            //console.log('cantidad de archivos input files:' + files.length);

            for(var i=0;i<files.length;i++){
                formData.append(name,files[i],files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST',url);
            xhr.setRequestHeader('Authorization',token);
            xhr.send(formData);
        });
    }
}