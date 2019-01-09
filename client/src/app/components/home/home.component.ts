import { Component, OnInit} from '@angular/core';

@Component({
    selector:'home',
    templateUrl:'./home.component.html'
})

export class HomeComponent implements OnInit{

    public title:string;

    constructor(){
        this.title = 'Bienvenido a Red Social'
    }

    ngOnInit(){
        console.log('componente home cargado');
    }

}