import { Bodega } from './../../modelos/bodega.model';
import { HomePage } from './../home/home';
import { SalidaAlmacen } from './../../modelos/salida-almacen.model';
import { CentroCosto } from './../../modelos/centro-costo.model';
import { Articulo } from '../../modelos/articulo.model';
import { ConsultaCentroCostoPage } from '../consulta-centro-costo/consulta-centro-costo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ConsultaArticuloPage } from '../consulta-articulo/consulta-articulo';

/**
 * Generated class for the AjusteAlmacenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ajuste-almacen',
  templateUrl: 'ajuste-almacen.html',
})
export class AjusteAlmacenPage {
  articuloSeleccionado: Articulo;
  centroSeleccionado1: CentroCosto = new CentroCosto();
  centroSeleccionado2: CentroCosto = new CentroCosto();
  centroBusqueda = 1;
  cantidad = 0;
  listaSalidas: SalidaAlmacen[] = [];
  bodega: Bodega;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public modalCtrl: ModalController, public toaster: ToastController) {
    this.articuloSeleccionado = new Articulo();
    this.bodega = JSON.parse(localStorage.getItem('bodega'));
  }

  ionViewDidEnter() {
    this.bodega = JSON.parse(localStorage.getItem('bodega'));
  }

  ionViewDidLoad() {
    if(!this.bodega) {
      this.enviarMensaje('Necesita seleccionar una bodega.');
      this.navCtrl.push(HomePage);
    }else {

    }
  }

  buscarProducto() {
    const modal = this.modalCtrl.create(ConsultaArticuloPage);
    modal.onDidDismiss(dato => {
      if (dato) {
          this.articuloSeleccionado = dato;
      }
    });
    modal.present();
  }

  buscarCentroCosteo(event) {
    this.centroBusqueda = event;
    const modal = this.modalCtrl.create(ConsultaCentroCostoPage);
    modal.onDidDismiss(dato => {
      if (dato) {
        if ((dato.Codigo !== this.centroSeleccionado1.codigo) && (dato.codigo !== this.centroSeleccionado2.codigo)) {
          if(this.centroBusqueda === 1) {
          
            this.centroSeleccionado1 = <CentroCosto>dato;
          } else {
            this.centroSeleccionado2 = <CentroCosto>dato;
          }
        }
      }
    });
    modal.present();
  }

  agregarLista() {
    if (this.articuloSeleccionado.codigo === '') {
      this.enviarMensaje('No puede estar vacio el articulo.');
      return false;
    }
    if ((!this.cantidad) || (this.cantidad === 0)) {
      this.enviarMensaje('No puede 0 la cantidad.');
      return false;
    }
    if (this.centroSeleccionado1.codigo === '') {
      this.enviarMensaje('No puede estar vacio el centro de costo 1.');
      return false;
    }
    if(this.centroSeleccionado1.codigo === this.centroSeleccionado2.codigo) {
      this.enviarMensaje('No puede ser igual el centro de costo 1 y 2.');
      return false;
    }

    this.listaSalidas.push({
      codigo : this.articuloSeleccionado.codigo,
      descripcion: this.articuloSeleccionado.descripcion.trim(),
      bodega: this.bodega.codigo.trim(),
      cantidad: this.cantidad
    });
    this.enviarMensaje('Salida Agregada Correctamente.');
    this.limpiar();
  }


  limpiar() {
    this.articuloSeleccionado = new Articulo();
    this.centroSeleccionado1 = new CentroCosto();
    this.centroSeleccionado2 = new CentroCosto();
    this.cantidad = 0;
  }
  enviarMensaje(mensaje) {
    const toast = this.toaster.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
