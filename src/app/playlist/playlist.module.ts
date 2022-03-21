import { OptionModalComponent } from './../modals/option-modal/option-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaylistPage } from './playlist.page';

import { PlaylistPageRoutingModule } from './playlist-routing.module';
import { CreatePlaylistComponent } from '../modals/create-playlist/create-playlist.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlaylistPageRoutingModule
  ],
  declarations: [PlaylistPage, CreatePlaylistComponent,OptionModalComponent]
})
export class PlaylistPageModule { }
