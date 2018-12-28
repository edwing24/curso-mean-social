import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router'; // cargamos rutas
import { User } from '../../models/user'; // cargamos nuestro modelo
import { UserService} from '../../services/user.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService] //cargamos servicios que debo tener en esta clase
})

export class RegisterComponent implements OnInit{

    public title:string;
    public user:User;
    public status:string;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title="Registrate";
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
        console.log('Componente de register cargado...');
    }

    onSubmit(registerForm){
        console.log('entro al meotod on submit para guardar')
        console.log(this.user);
        this._userService.register(this.user).subscribe(
            response=>{
                console.log('entre al metodo de nodejs')
                if(response.user && response.user._id){
                    //console.log(response);
                    //console.log(response.user);
                    //console.log('Usuario registrado correctamente');
                    this.status = "success";

                    registerForm.reset();
                }else{
                    this.status="error";
                }

                //console.log(response);
                //console.log(response.user);
                //console.log(response._id);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}
