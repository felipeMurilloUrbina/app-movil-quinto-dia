import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContenedorTabsPage } from './contenedor-tabs';

@NgModule({
  declarations: [
    ContenedorTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContenedorTabsPage),
  ],
})
export class ContenedorTabsPageModule {}
