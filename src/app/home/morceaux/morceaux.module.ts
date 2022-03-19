import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MorceauxRoutingModule } from './morceaux-routing.module';
import { MorceauxComponent } from './morceaux.component';


@NgModule({
  declarations: [MorceauxComponent],
  imports: [
    CommonModule,
    MorceauxRoutingModule,
    IonicModule
  ]
})
export class MorceauxModule { }
