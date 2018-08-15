import { SalidaAlmacenService } from './../../servicios/salida-almacen.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AjusteAlmacenPage } from './ajuste-almacen';

@NgModule({
  declarations: [
    AjusteAlmacenPage,
  ],
  imports: [
    IonicPageModule.forChild(AjusteAlmacenPage),
  ],
  providers: [SalidaAlmacenService]
})
export class AjusteAlmacenPageModule {}
