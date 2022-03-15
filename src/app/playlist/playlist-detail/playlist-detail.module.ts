import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistDetailRoutingModule } from './playlist-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { CreateMusiqueComponent } from 'src/app/modals/create-musique/create-musique.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayMusicPageComponent } from 'src/app/home/play-music-page/play-music-page.component';


@NgModule({
  declarations: [
    PlaylistDetailComponent,
    CreateMusiqueComponent,
    PlayMusicPageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    PlaylistDetailRoutingModule
  ]
})
export class PlaylistDetailModule { }
