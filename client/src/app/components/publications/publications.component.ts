import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { userInfo } from 'os';
//import { $ } from 'protactor';
declare var $: any; //para usar jquery solo es necesario agregar esto o este import * from 'jquery';
//https://medium.com/@swarnakishore/how-to-include-and-use-jquery-in-angular-cli-project-592e0fe63176

@Component({
    selector:'publications',
    templateUrl:'publications.component.html',
    providers:[PublicationService]
})

export class PublicationsComponent implements OnInit{
    public identity;
    public token;
    public title:string;
    public url:string;
    public status:string;
    public page;
    private total;
    private pages;
    private itemsPerPage;
    public publications: Publication[];
    @Input() user;

    constructor(private _route:ActivatedRoute, private _router:Router,private _userService: UserService, private _publicationService: PublicationService){
        this.title="Publications";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.gettoken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit(){
        console.log('publications.component cargado correctamente');
        this.getPublications(this.user,this.page);
    }

    getPublications(user,page,adding=false){
        console.log('getpublications de timeline si entro')
        this._publicationService.getPublicationsUser(this.token,user,page).subscribe(
            response=>{
                //console.log(response);
                if(response.publications){
                    console.log("PUBLICACIONES DEL USUARIO: " + response.publications );
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.items_per_page;

                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $("html, body").animate({scrollTop:$('html').prop("scrollHeight")},500);
                    }

                    if(page>this.pages){
                        //this._router.navigate(['/home']);
                    }

                }else{
                    this.status = "error";
                }
                //this.getPublications(this.page);
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

    public noMore = false;
    viewMore(){
        this.page+=1;
        if(this.page==this.pages){
            this.noMore= true;
        }else{
        }

        this.getPublications(this.user,this.page,true);
    }


}