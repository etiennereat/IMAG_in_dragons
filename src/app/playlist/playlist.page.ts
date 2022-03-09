import { Component, Inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePlaylistComponent } from '../modals/create-playlist/create-playlist.component';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist.service';
import { EMPTY, Observable } from 'rxjs';

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

  delete(playlist: Playlist) {
    this.playlistService.removePlaylist(playlist);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreatePlaylistComponent
    });
    await modal.present();
    // this.playlists = this.playlistService.getAll();
  }

}
