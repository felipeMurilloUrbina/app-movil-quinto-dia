import { ArticuloService } from './../../servicios/articulo.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Articulo } from '../../modelos/articulo.model';

/**
 * Generated class for the ConsultaArticuloPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consulta-articulo',
  templateUrl: 'consulta-articulo.html',
})
export class ConsultaArticuloPage {
  totalArts: Articulo[];
  filtroArts: Articulo[];
  totalRegistros = 0;
  pagina = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public servicio: ArticuloService, public loadingCtrl: LoadingController, public viewController: ViewController) {
    this.totalArts = [];
  }

  cerrar() {
    this.viewController.dismiss();
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Obteniendo Articulos...',
    });
    loader.present().then(() => {
      this.servicio.getLocal('', 10).then(dato => {
        this.totalArts = <Articulo[]>dato;
        loader.dismiss();
        this.resetearBusqueda();
      });
    });
  }

  seleccionar(articulo) {
    this.viewController.dismiss(articulo);
  }

  resetearBusqueda() {
    if (!this.totalArts) {
      this.totalArts = [];
    }
    this.filtroArts = this.totalArts;
  }

  buscar(ev: any) {
    this.resetearBusqueda();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.servicio.getLocal(val, 10).then(dato => {
        this.filtroArts = <Articulo[]>dato;
      });
    }
   
  }
}
