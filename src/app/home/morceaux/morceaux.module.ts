import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MorceauxRoutingModule } from './morceaux-routing.module';
import { MorceauxComponent } from './morceaux.component';
import { AddMusiqueComponent } from 'src/app/modals/add-musique/add-musique.component';


@NgModule({
  declarations: [MorceauxComponent, AddMusiqueComponent],
  imports: [
    CommonModule,
    MorceauxRoutingModule,
    IonicModule
  ]
})
export class MorceauxModule { }
