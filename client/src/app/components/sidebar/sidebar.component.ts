import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication} from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { setTNodeAndViewData } from '@angular/core/src/render3/state';
import { UploadService } from '../../services/upload.service';



@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers:[UserService,PublicationService, UploadService]
})

export class SidebarComponent implements OnInit{
    public identity;
    public token;
    public stats;
    public url;
    public status;
    public publication: Publication;

    constructor(private _userService: UserService, private _publicationService:PublicationService, private _uploadService:UploadService, private _route: ActivatedRoute, private _router:  Router){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.gettoken();
        console.log("constructor sidebar");
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
        this.publication = new Publication("","","","",this.identity._id);
    }

    ngOnInit(){
        console.log("sidebar.component ha sido cargado");
        console.log("datos del sidebar: " + this.stats);
    }

    public filesToUpload:Array<File>;
    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    onSubmit(form){
        console.log(this.publication);
        this._publicationService.addPublication(this.token,this.publication).subscribe(
            response => {
                if(response.publication){
                    //this.publication = response.publication;

                    //subir imagen
                    this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id,[],this.filesToUpload,this.token,'image')
                                       .then((result:any)=>{
                                           console.log("result de publication.js: " + result.publication);
                                            this.publication.file = result.publication.file;
                                            console.log(this.publication);
                                            this.status = "success";
                                            form.reset();
                                            this._router.navigate(['/timeline']); //cuando guardemos redireccionamos a timeline para actualizar los datos
                                       });
                }else{
                    this.status = "error";
                }
            },
            error =>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage!=null){
                    this.status="error";
                }
            }
        );
    }

    // Output
    @Output() sended = new EventEmitter(); //se usa en el component padre timeline.component.html en la etiqueta sidebar
    sendPublication(event){
        console.log("entro al metodo : sendPublication")
        console.log(event);
        this.sended.emit({send:'true'});
    }


}