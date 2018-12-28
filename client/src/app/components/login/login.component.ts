import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService] //cargamos el servicio de usuario
})

export class LoginComponent implements OnInit{

    public title:string;
    public user:User;
    public status:string;
    public identity;
    public token;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService

    ){
        this.title="Identificate";
        this.user=new User(
            "",
            "",
            "",
            "",
            "",
            "",
            "ROLE_USER",
            ""
        );
    }

    ngOnInit(){
        console.log('Componente de login cargado...');
    }

    onSubmit(){
        //alert(this.user.email);
        //alert(this.user.password);
        //console.log(this.user);

        //loguear al usuario y obtener sus datos
        this._userService.singUp(this.user).subscribe(
            response=>{
                //console.log('ver si trae apellido '+response.user);
                this.identity=response.user;
                //console.log('que se guardo en identity '+this.identity);
                if(!this.identity || !this.identity._id){
                    this.status = 'error'
                }else{
                    //this.status = 'success'
                    //PERSISTIR DATOS DEL USUARIO
                    localStorage.setItem('identity',JSON.stringify(this.identity)); // local storage es para persistir los datos del usuario (sesión) pero no guarda datos de javascrpt por eso se castea mi json a string.
                    //conseguir el token
                    this.gettoken();
                }
            },
            error=>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage!=null){
                    this.status = 'error';
                }
            }
        );
    }

    gettoken(){
        this._userService.singUp(this.user,'true').subscribe(
            response =>{
                this.token = response.token;

                if(this.token.length<=0){
                    this.status = 'error';
                }else{
                    //this.status = 'success';

                    //PERSISTIR TOKEN DEL USUARIO
                    console.log('guardo en localstorage el token')
                    localStorage.setItem('token',this.token);
                    console.log(this.token);
                    //Conseguir os contadores o estadisticas del usuario
                    console.log('voy a obtener counters');
                    this.getCounters();

                    //this._router.navigate(['/']);
                }
            },
            error=>{
                var errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage!=null){
                    this.status = 'error';
                }
            }
        );
    }

    getCounters(){
        this._userService.getCounters().subscribe(
            response =>{
                console.log('guardo en localstorage los stats');
                localStorage.setItem('stats',JSON.stringify(response));
                this.status = "success";
                this._router.navigate(['/']);
            },
            error=>{
                console.log(<any>error);
            }
        )
    }

}
