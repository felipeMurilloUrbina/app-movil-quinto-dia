import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  usuario : Usuario;
  constructor(public navCtrl: NavController, public navParams: NavParams, private _service: AutentificacionService) {
    this.usuario = new Usuario();
    this.usuario.rfc = 'xxxxxxx';
  }

  ionViewDidLoad() {

  }

  entrar() {
    console.log('aaaa');
    console.log(this.usuario);
  }
}
