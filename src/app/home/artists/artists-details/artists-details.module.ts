import { ArtistsDetailsComponent } from './artists-details.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistsDetailsRoutingModule } from './artists-details-routing.module';


@NgModule({
  declarations: [ArtistsDetailsComponent],
  imports: [
    CommonModule,
    ArtistsDetailsRoutingModule,
    IonicModule
  ]
})
export class ArtistsDetailsModule { }
