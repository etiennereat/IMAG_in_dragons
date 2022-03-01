import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AlbumsComponent } from './albums/albums.component';
import { MorceauxComponent } from './morceaux/morceaux.component';
import { HomeComponent } from './home.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [HomeComponent, AlbumsComponent, MorceauxComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IonicModule.forRoot()
  ]
})
export class HomeModule { }
