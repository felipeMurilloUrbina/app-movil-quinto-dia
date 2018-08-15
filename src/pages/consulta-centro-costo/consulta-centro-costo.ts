import { CentroCosto } from './../../modelos/centro-costo.model';
import { CentroCostoService } from '../../servicios/centro-costo.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ConsultaCentroCostoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consulta-centro-costo',
  templateUrl: 'consulta-centro-costo.html',
})
export class ConsultaCentroCostoPage {
  totalArts: CentroCosto[] = [];
  filtroArts: CentroCosto[];
  totalRegistros = 0;
  pagina = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public servicio: CentroCostoService, public loadingCtrl: LoadingController, public viewController: ViewController) {
  }

  cerrar() {
    this.viewController.dismiss();
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Obteniendo Centro de Costos...',
    });
  
    loader.present().then(() => {
      this.servicio.getLocal('', 10).then(dato => {
        this.totalArts= <CentroCosto[]>dato;
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
        this.filtroArts = <CentroCosto[]>dato;
      });
    }
  }
}
