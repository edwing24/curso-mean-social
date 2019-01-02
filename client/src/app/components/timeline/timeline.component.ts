import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

@Component({
    selector:'timeline',
    templateUrl:'timeline.component.html',
    providers:[PublicationService]
})

export class TimelineComponent implements OnInit{
    public identity;
    public token;
    public title:string;
    public url:string;
    public status:string;
    public page;
    private total;
    private pages;
    public publications: Publication[];

    constructor(private _route:ActivatedRoute, private _router:Router,private _userService: UserService, private _publicationService: PublicationService){
        this.title="Timeline";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.gettoken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit(){
        console.log('timeline.component cargado correctamente');
        this.getPublications(this.page);
    }

    getPublications(page){
        console.log('getpublications de timeline si entro')
        this._publicationService.getPublications(this.token,page).subscribe(
            response=>{
                //console.log(response);
                if(response.publications){
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.publications = response.publications;

                    if(page>this.pages){
                        this._router.navigate(['/home']);
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


}