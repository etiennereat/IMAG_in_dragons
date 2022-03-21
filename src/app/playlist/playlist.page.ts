import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePlaylistComponent } from '../modals/create-playlist/create-playlist.component';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist.service';
import { EMPTY, Observable } from 'rxjs';
import { OptionModalComponent } from '../modals/option-modal/option-modal.component';

@Component({
  selector: 'app-playlist',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  playlists$: Observable<Playlist[]> = EMPTY;

  constructor(private playlistService: PlaylistService,
    private modalController: ModalController) {
  }

  ngOnInit(): void {
    this.playlists$ = this.playlistService.getAll();
  }

  delete(id: string) {
    this.playlistService.removePlaylist(id);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreatePlaylistComponent,
      initialBreakpoint:0.4
    });
    await modal.present();
    // this.playlists = this.playlistService.getAll();
  }

  async openOptionModal(playlist:Playlist){
    const modal = await this.modalController.create({
      component: OptionModalComponent,
      initialBreakpoint:0.6,
      componentProps:{
        playlists:playlist
      }
    });
    await modal.present();
  }

}
