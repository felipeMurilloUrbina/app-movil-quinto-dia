import { BodegaService } from './../servicios/bodega.service';
import { ConsultaArticuloPageModule } from './../pages/consulta-articulo/consulta-articulo.module';
import { AjusteAlmacenPageModule } from './../pages/ajuste-almacen/ajuste-almacen.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AutentificacionService } from '../servicios/autentificacion.service';
import { HttpClientModule } from '@angular/common/http';
import { ContenedorTabsPageModule } from '../pages/contenedor-tabs/contenedor-tabs.module';
import { EstanquePageModule } from '../pages/estanque/estanque.module';
import { ConsultaCentroCostoPageModule } from '../pages/consulta-centro-costo/consulta-centro-costo.module';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ContenedorTabsPageModule,
    AjusteAlmacenPageModule,
    EstanquePageModule,
    ConsultaArticuloPageModule,
    ConsultaCentroCostoPageModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BodegaService,
    AutentificacionService,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
