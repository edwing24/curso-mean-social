import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'; // se importa este sino sale error cuando quiere trabajar ya con los formularios. 
//import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http'; // para hacer peticiones http y ajax es el mas nuevo
import {routing,appRoutingProviders} from './app.routing'; //este import es del archivo que creamos app.routing.ts
import { MomentModule } from 'angular2-moment';

//cargar componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from  './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent }  from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent
    ,
    PublicationsComponent
  ],
  imports: [
    BrowserModule,
    routing, //aqui ponemos el de routing
    FormsModule, //lo cargamos,
    HttpClientModule,
    MomentModule //para la hora y fecha
  ],
  providers: [
    appRoutingProviders // aqui pasamos el de approutingproviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
