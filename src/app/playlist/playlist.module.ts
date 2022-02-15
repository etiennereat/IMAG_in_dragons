import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaylistPage } from './playlist.page';

import { PlaylistPageRoutingModule } from './playlist-routing.module';
import { CreatePlaylistComponent } from '../modals/create-playlist/create-playlist.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlaylistPageRoutingModule
  ],
  declarations: [PlaylistPage, CreatePlaylistComponent]
})
export class PlaylistPageModule { }
