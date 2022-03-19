import { MusicPopoverComponent } from './../../popovers/music-popover/music-popover.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MorceauxRoutingModule } from './morceaux-routing.module';


@NgModule({
  declarations: [MusicPopoverComponent],
  imports: [
    CommonModule,
    MorceauxRoutingModule,
    IonicModule
  ]
})
export class MorceauxModule { }
