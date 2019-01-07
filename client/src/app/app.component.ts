import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService] //puedo agregar mas providers dividos por coma?
})
export class AppComponent implements OnInit, DoCheck { // implementamos OnInit y DoChek para que se actualice la página apenas haya un cambio a nivel de componentes
  public title:string;
  public identity;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router:Router,
    private _userService:UserService
  ){
    this.title="SOCIAL RED";
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity=null;
    this._router.navigate(['/']);
  }

}
