import { Storage } from '@ionic/storage';
import { SalidaAlmacenService } from './../../servicios/salida-almacen.service';
import { Bodega } from './../../modelos/bodega.model';
import { SalidaAlmacen } from './../../modelos/salida-almacen.model';
import { CentroCosto } from './../../modelos/centro-costo.model';
import { Articulo } from '../../modelos/articulo.model';
import { ConsultaCentroCostoPage } from '../consulta-centro-costo/consulta-centro-costo';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ConsultaArticuloPage } from '../consulta-articulo/consulta-articulo';
import { DetalleSalidaPage } from '../detalle-salida/detalle-salida';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  salida: SalidaAlmacen;
  listaSalidas: SalidaAlmacen[] = [];
  bodega: Bodega;
  usuario: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loaderCrtl: LoadingController,
    public toaster: ToastController,
    public servicio: SalidaAlmacenService,
    public storage: Storage) {
    this.articuloSeleccionado = new Articulo();
    this.salida = new SalidaAlmacen();
    this.getBodega();    
    storage.get('token').then((valor) => {
      const servicioJWT = new  JwtHelperService();
      this.usuario = servicioJWT.decodeToken(valor);
    });
  }

  ionViewDidEnter() {
    this.getBodega();
    this.getFolio();    
  }

  getBodega() { 
    this.storage.get('bodega').then((bodega) => {
      this.bodega = bodega;
    });
  }

  ionViewDidLoad() {
    this.getFolio();
  }

  getFolio() {
    const loader = this.loaderCrtl.create({
      content: 'Obteniendo Folio...'
    });
    loader.present().then(()=> {
      this.servicio.getFolio().then((dato) => {
        if (dato.folio == null) {
          this.salida.folio = 1;
        } else {
          this.salida.folio = dato.folio + 1;
        }
        loader.dismiss();
      }).catch((err)=>{
        this.salida.folio = 1;
        loader.dismiss();
        console.log(err);
      });
    });
  }

  verDetalles() {
    this.servicio.getLocal('', 10, this.salida.folio).then((dato) => {
      if (dato && dato.length > 0)
        this.navCtrl.push(DetalleSalidaPage, { folio: this.salida.folio}, {animate: true, direction: 'forward'});
    });
  }
  
  buscarProducto() {
    this.articuloSeleccionado = new Articulo();
    const modal = this.modalCtrl.create(ConsultaArticuloPage);
    modal.onDidDismiss(dato => {
      if (dato) {
        this.articuloSeleccionado = dato;
        this.salida.codigoArticulo = this.articuloSeleccionado.codigo;
        this.salida.descripcion = this.articuloSeleccionado.descripcion;
        this.salida.unidad = this.articuloSeleccionado.unidad;
        this.salida.costoPromedio = this.articuloSeleccionado.costoPromedio;
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
            this.salida.codigoCentroCosto1 =this.centroSeleccionado1.codigo + '--' + this.centroSeleccionado1.descripcion.trim();
          } else {
            this.centroSeleccionado2 = <CentroCosto>dato;
            this.salida.codigoCentroCosto2 =this.centroSeleccionado2.codigo + '--' + this.centroSeleccionado2.codigo.trim();

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
    if (this.salida.cantidad > this.articuloSeleccionado.existencia) {
      this.enviarMensaje('La cantidad no puede ser mayor ala existencia del articulo. Sincronice existencias.');
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
    this.setFecha();
    this.salida.usuario = this.usuario['unique_name'];
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

  setFecha() {
    const fecha = new Date();
    const mes =(fecha.getUTCMonth() + 1).toString().length === 1 ? '0'+ (fecha.getUTCMonth() + 1) : (fecha.getUTCMonth() + 1);
    const dia = fecha.getDate().toString().length === 1 ? '0' + fecha.getDate() : fecha.getDate(); 
    this.salida.fecha = fecha.getUTCFullYear() + '' + mes + '' + dia;
    this.salida.hora = fecha.getHours() + '' + (fecha.getMinutes().toString().length === 1 ? '0' + fecha.getMinutes(): fecha.getMinutes()) + '' + (fecha.getSeconds().toString().length === 1 ? '0' + fecha.getSeconds(): fecha.getSeconds());
  }

  limpiar() {
    this.articuloSeleccionado = new Articulo();
    this.centroSeleccionado1 = new CentroCosto();
    this.centroSeleccionado2 = new CentroCosto();
    this.salida = new SalidaAlmacen();
    this.getFolio();
  }

  enviarMensaje(mensaje) {
    const toast = this.toaster.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
