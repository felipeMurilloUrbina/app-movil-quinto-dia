import { SalidaAlmacenService } from './../../servicios/salida-almacen.service';
import { SalidaAlmacen } from './../../modelos/salida-almacen.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalleSalidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-salida',
  templateUrl: 'detalle-salida.html',
})
export class DetalleSalidaPage {
  lista: SalidaAlmacen[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public servicio: SalidaAlmacenService) {
    this.lista = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleSalidaPage');
    this.get();
  }

  get() {
    this.servicio.getLocal('', 20).then((dato)=> {
      console.log(dato);
    }).catch((error)=> {
      console.log(error);
    })
  }

}
