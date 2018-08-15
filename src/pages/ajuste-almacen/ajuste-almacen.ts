import { SalidaAlmacenService } from './../../servicios/salida-almacen.service';
import { Bodega } from './../../modelos/bodega.model';
import { HomePage } from './../home/home';
import { SalidaAlmacen } from './../../modelos/salida-almacen.model';
import { CentroCosto } from './../../modelos/centro-costo.model';
import { Articulo } from '../../modelos/articulo.model';
import { ConsultaCentroCostoPage } from '../consulta-centro-costo/consulta-centro-costo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ConsultaArticuloPage } from '../consulta-articulo/consulta-articulo';
import { DetalleSalidaPage } from '../detalle-salida/detalle-salida';

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
  salida: SalidaAlmacen;
  listaSalidas: SalidaAlmacen[] = [];
  bodega: Bodega;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public modalCtrl: ModalController, public loaderCrtl: LoadingController, public toaster: ToastController, public servicio: SalidaAlmacenService) {
    this.articuloSeleccionado = new Articulo();
    this.salida = new SalidaAlmacen();
    this.bodega = JSON.parse(localStorage.getItem('bodega'));
  }

  ionViewDidEnter() {
    this.bodega = JSON.parse(localStorage.getItem('bodega'));
  }

  ionViewDidLoad() {
    this.getFolio();
    if(!this.bodega) {
      this.enviarMensaje('Necesita seleccionar una bodega.');
      this.navCtrl.push(HomePage);
    }else {

    }
  }

  getFolio() {
    this.servicio.getFolio().then((dato)=> {
      console.log(dato);
      if (dato.folio == null) {
        this.salida.folio = 1;
      } else {
        this.salida.folio = dato.folio;
      }
    }).catch((err)=>{
      console.log(err);
    });
  }

  verDetalles() {
    this.navCtrl.push(DetalleSalidaPage);
  }
  
  buscarProducto() {
    this.articuloSeleccionado = new Articulo();
    const modal = this.modalCtrl.create(ConsultaArticuloPage);
    modal.onDidDismiss(dato => {
      if (dato) {
        this.articuloSeleccionado = dato;
        this.salida.codigoArticulo = this.articuloSeleccionado.codigo;
        this.salida.descripcion= this.articuloSeleccionado.descripcion;
      }
    });
    modal.present();
  }

  buscarCentroCosteo(event) {
    this.centroBusqueda = event;
    this.centroSeleccionado1 = this.centroBusqueda === 1 ? new CentroCosto() : this.centroSeleccionado1; 
    this.centroSeleccionado2 = this.centroBusqueda === 2 ? new CentroCosto() : this.centroSeleccionado2; 
    const modal = this.modalCtrl.create(ConsultaCentroCostoPage);
    modal.onDidDismiss(dato => {
      if (dato) {
        if ((dato.Codigo !== this.centroSeleccionado1.codigo) && (dato.codigo !== this.centroSeleccionado2.codigo)) {
          if(this.centroBusqueda === 1) {
            this.centroSeleccionado1 = <CentroCosto>dato;
            this.salida.codigoCentroCosto1 =this.centroSeleccionado1.codigo;
          } else {
            this.centroSeleccionado2 = <CentroCosto>dato;
            this.salida.codigoCentroCosto2 = this.centroSeleccionado2.codigo;
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
    if ((!this.salida.cantidad) || (this.salida.cantidad === 0)) {
      this.enviarMensaje('La cantidad no puede ser 0.');
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
    this.salida.fecha = new Date();
    console.log(this.salida);
    this.listaSalidas.push(this.salida);    
    const loader = this.loaderCrtl.create({
      content: 'Guardando Salida...'
    });
    loader.present().then(()=>{
      this.servicio.guardarLocal(this.salida).then(dato => {
        this.enviarMensaje('Salida Agregada Correctamente.');
        this.limpiar();
        loader.dismiss();
      }).catch((error) => {
        console.log(error);
        loader.dismiss();
      });
    });
  }

  limpiar() {
    this.articuloSeleccionado = new Articulo();
    this.centroSeleccionado1 = new CentroCosto();
    this.centroSeleccionado2 = new CentroCosto();
    this.salida = new SalidaAlmacen();
  }
  enviarMensaje(mensaje) {
    const toast = this.toaster.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
