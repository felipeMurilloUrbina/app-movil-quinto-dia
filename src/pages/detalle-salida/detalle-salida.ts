import { SalidaAlmacenService } from './../../servicios/salida-almacen.service';
import { SalidaAlmacen } from './../../modelos/salida-almacen.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

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
  folio = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loaderCrtl: LoadingController,
    public servicio: SalidaAlmacenService,
    public toaster: ToastController,
    public alertCtrl: AlertController) {
    this.lista = [];
    this.folio = navParams.get('folio');
    if(!this.folio) { 
      this.navCtrl.pop();
    }
  }

  ionViewDidEnter() {
    this.folio = this.navParams.get('folio');
    if(!this.folio) { 
      this.navCtrl.pop();
    }
  }

  ionViewDidLoad() {
    this.get();
  }

  mostrarConfirmacion() {
    const confirm = this.alertCtrl.create({
      title: 'Eliminar Todas las salidas?',
      message: 'Esta seguro que desea eliminar todas las salidas?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.eliminarTodaSalidas();
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  get() {
    this.servicio.getLocal('', 20, this.folio).then((dato)=> {
      this.lista = <SalidaAlmacen[]>dato;
      if (this.lista.length === 0)
        this.navCtrl.pop();
    }).catch((error) => {
      this.navCtrl.pop();
      console.log(error);
    })
  }

  buscar(dato) {    
  }

  enviar() {
    const loader = this.loaderCrtl.create({
      content: 'Revisando para enviar...'
    });
    loader.present().then(()=> {
      this.servicio.cambiarEstatus(this.folio, true).then((dato)=> {
        // console.log('enviar');
        loader.dismiss();
        this.enviarMensaje('Se Reviso Correctamente.');
        this.navCtrl.pop();
      }).catch((error) => {
        this.enviarMensaje('Ocurrio un error al revisar.');
        this.navCtrl.pop();
      });
    });
  }

  eliminarSalida(salida) {
    this.servicio.eliminarSalida(salida).then(()=> {
      this.enviarMensaje('Se Elimino correctamente la salida.');
      this.get();
    })
  }

  eliminarTodaSalidas() {
    this.servicio.eliminarSalidas(this.folio).then(()=> {
      this.enviarMensaje('Se Elimino correctamente las salidas');
      this.navCtrl.pop();
    })
  }

  enviarMensaje(mensaje) {
    const toast = this.toaster.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
