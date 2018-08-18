import { BackgroundMode } from '@ionic-native/background-mode';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LoginPageModule } from './../pages/login/login.module';
import { BodegaService } from './../servicios/bodega.service';
import { ConsultaArticuloPageModule } from './../pages/consulta-articulo/consulta-articulo.module';
import { AjusteAlmacenPageModule } from './../pages/ajuste-almacen/ajuste-almacen.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AutentificacionService } from '../servicios/autentificacion.service';
import { HttpClientModule } from '@angular/common/http';
import { ContenedorTabsPageModule } from '../pages/contenedor-tabs/contenedor-tabs.module';
import { EstanquePageModule } from '../pages/estanque/estanque.module';
import { ConsultaCentroCostoPageModule } from '../pages/consulta-centro-costo/consulta-centro-costo.module';
import { SQLite } from '@ionic-native/sqlite';
import { SQLiteService } from '../servicios/sqlite.service';
import { ChartsModule } from 'ng2-charts';
import { SignupPageModule } from '../pages/signup/signup.module';
import { DetalleSalidaPageModule } from '../pages/detalle-salida/detalle-salida.module';
import { JwtHelperService } from '@auth0/angular-jwt';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    ContenedorTabsPageModule,
    AjusteAlmacenPageModule,
    EstanquePageModule,
    LoginPageModule,
    SignupPageModule,
    DetalleSalidaPageModule,
    ConsultaArticuloPageModule,
    ConsultaCentroCostoPageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    BackgroundMode,
    Diagnostic,
    StatusBar,
    SplashScreen,
    BodegaService,
    Geolocation,
    JwtHelperService,
    AutentificacionService,
    SQLite,
    SQLiteService,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
