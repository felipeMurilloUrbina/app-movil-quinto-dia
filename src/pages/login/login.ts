import { ContenedorTabsPage } from './../contenedor-tabs/contenedor-tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform } from 'ionic-angular';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { Usuario } from '../../modelos/usuario.model';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AutentificacionService]
})
export class LoginPage {

  usuario: Usuario;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _service: AutentificacionService,
    public loadingController: LoadingController, 
    public toaster: ToastController) {
    this.usuario = new Usuario();
  }

  ionViewDidLoad() {
    this.usuario.username = 'adminS';
    this.usuario.password= 'Admin*';
    // if(localStorage.getItem('token')) {
    //   this.navCtrl.setRoot(ContenedorTabsPage);
    // }
  }

  entrar() {
    const loader = this.loadingController.create({content: "Entrando..."});
    loader.present().then(() => {
      this._service.login(this.usuario).subscribe(data => {
      this.navCtrl.setRoot(ContenedorTabsPage);
        loader.dismiss();
      }, error => {
        loader.dismiss();
        this.enviarMensaje(error.error.error_description ? 'Ocurrio un error al conectarse al servidor' : error.error.error_description );
        this.usuario = new Usuario();
      });
    });
  }
  
  enviarMensaje(mensaje) {
    const toast = this.toaster.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
  
  salir() {
    this.platform.exitApp();
  }
}
