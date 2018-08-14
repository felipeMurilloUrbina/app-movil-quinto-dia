import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstanquePage } from './estanque';

@NgModule({
  declarations: [
    EstanquePage,
  ],
  imports: [
    IonicPageModule.forChild(EstanquePage),
  ],
})
export class EstanquePageModule {}
