import { CentroCostoService } from './../../servicios/centro-costo.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultaCentroCostoPage } from './consulta-centro-costo';

@NgModule({
  declarations: [
    ConsultaCentroCostoPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultaCentroCostoPage),
  ],
  providers: [CentroCostoService]
})
export class ConsultaCentroCostoPageModule {}
