import { Bodega } from '../../modelos/bodega.model';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BodegaService } from '../../servicios/bodega.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  usuario = 'Felipe de Jesus Murillo Urbina';
  bodega: any;
  bodegaId = '';
  bodegas: Bodega[] = [];
  constructor(public navCtrl: NavController,  public servicio: BodegaService) {
    this.get();
    
  }

  get() {
    this.servicio.getAll(1, 0).subscribe(dato =>{
      this.bodegas = <Bodega[]>dato['items'];
    });
  }

  seleccionarBodega() {
    localStorage.removeItem('bodega');
    localStorage.setItem('bodega',JSON.stringify(this.bodegas.find(b => b.codigo === this.bodegaId)));
  }
}
