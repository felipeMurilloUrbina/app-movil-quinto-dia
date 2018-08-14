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
      this.servicio.getAll(this.pagina,500).subscribe(data => {
        this.totalArts =this.totalArts.concat(<CentroCosto[]>data['items']);
        this.totalRegistros = <number>data['totalItems'];
        if(this.totalRegistros > this.totalArts.length) {
          this.getInfoBackground();
          this.pagina++;
        }
        this.resetearBusqueda();
      }, error =>{
        loader.dismiss();
      }, ()=> {
        loader.dismiss();
      });
    });
  }

  getInfoBackground() {
    this.servicio.getAll(this.pagina,500).subscribe(data => {
      this.totalArts =this.totalArts.concat(<CentroCosto[]>data['items']);
      this.totalRegistros = <number>data['totalItems'];
      if(this.totalRegistros > this.totalArts.length) {
        this.getInfoBackground();
        this.pagina++;
      }
      this.resetearBusqueda();
    }, error =>{
    }, ()=> {
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
      this.filtroArts = this.totalArts.filter((item) => {
        return (item.descripcion.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      if (this.filtroArts.length == 0) {
        this.filtroArts = this.totalArts.filter((item) => {
          return (item.codigo.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      }
    }
  }

}
