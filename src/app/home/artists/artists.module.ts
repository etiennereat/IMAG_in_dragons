import { IonicModule } from '@ionic/angular';
import { ArtistsComponent } from './artists.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistsRoutingModule } from './artists-routing.module';


@NgModule({
  declarations: [ArtistsComponent],
  imports: [
    CommonModule,
    ArtistsRoutingModule,
    IonicModule
  ]
})
export class ArtistsModule { }
