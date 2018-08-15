import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleSalidaPage } from './detalle-salida';

@NgModule({
  declarations: [
    DetalleSalidaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleSalidaPage),
  ],
})
export class DetalleSalidaPageModule {}
