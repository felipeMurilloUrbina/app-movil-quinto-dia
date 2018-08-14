import { ArticuloService } from './../../servicios/articulo.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultaArticuloPage } from './consulta-articulo';

@NgModule({
  declarations: [
    ConsultaArticuloPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultaArticuloPage),
  ],
  providers: 
  [ArticuloService],
})
export class ConsultaArticuloPageModule {}
