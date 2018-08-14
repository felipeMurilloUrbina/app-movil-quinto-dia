import { LoginPage } from './../login/login';
import { AutentificacionService } from './../../servicios/autentificacion.service';
import { EstanquePage } from './../estanque/estanque';
import { AjusteAlmacenPage } from './../ajuste-almacen/ajuste-almacen';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private servicio: AutentificacionService) {
  }

  ionViewDidLoad() {
  }

  salir() {
    console.log('aaaaa');
    this.servicio.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
