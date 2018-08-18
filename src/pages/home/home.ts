import { Granja } from './../../modelos/granja.model';
import { Storage } from '@ionic/storage';
import { Bodega } from '../../modelos/bodega.model';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BodegaService } from '../../servicios/bodega.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  usuario: any;
  nombreUsuario = '';
  bodega: any;
  granjaId = '';
  bodegas: Bodega[] = [];
  granjas: Granja[] = [];
  constructor(public navCtrl: NavController,  public servicio: BodegaService,  public storage: Storage) {
    storage.get('token').then((valor) => {
      const servicioJWT = new  JwtHelperService();
      this.usuario = servicioJWT.decodeToken(valor);
      this.granjas = <Granja[]>JSON.parse(this.usuario["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"]);
      this.nombreUsuario = this.usuario['NombreCompleto'];
    });
  }

  seleccionarBodega() {
    localStorage.removeItem('conexionString');
    localStorage.setItem('bodega', '110');
    localStorage.setItem('granja',JSON.stringify(this.granjas.find(b => b.Id === parseFloat(this.granjaId)).ConexionString));
  }
}
