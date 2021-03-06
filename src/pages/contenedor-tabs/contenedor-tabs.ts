import { CentroCostoService } from './../../servicios/centro-costo.service';
import { ArticuloService } from './../../servicios/articulo.service';
import { LoginPage } from './../login/login';
import { AutentificacionService } from './../../servicios/autentificacion.service';
import { EstanquePage } from './../estanque/estanque';
import { AjusteAlmacenPage } from './../ajuste-almacen/ajuste-almacen';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AutorizacionPage } from '../autorizacion/autorizacion';

/**
 * Generated class for the ContenedorTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contenedor-tabs',
  templateUrl: 'contenedor-tabs.html',
})
export class ContenedorTabsPage {
  inicio = HomePage;
  ajusteAlmacen = AjusteAlmacenPage;
  estanque = EstanquePage;
  autorizacion = AutorizacionPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, private servicio: AutentificacionService, public servicioArticulo: ArticuloService,  public servicioCentroCosto: CentroCostoService, private loaderCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  salir() {
    console.log('aaaaa');
    this.servicio.logout();
    this.navCtrl.setRoot(LoginPage);
  }
  
  sincronizarInfo() {
    const loader= this.loaderCtrl.create({
      content: 'Sincronizando Informacion...'
    });
    loader.present().then(() => {
      this.servicioArticulo.sincronizarInfo().add((dato)=>{
        this.servicioCentroCosto.sincronizarInfo().add((dato)=>{
          loader.dismiss();
        });
        // loader.dismiss();
      });
    });
  }

}
