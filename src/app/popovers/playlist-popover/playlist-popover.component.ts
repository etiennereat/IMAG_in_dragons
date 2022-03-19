import { PopoverController, ToastController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Component, Input, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Playlist } from 'src/app/models/playlist';
import { Musique } from 'src/app/models/Musique';

@Component({
  selector: 'app-playlist-popover',
  templateUrl: './playlist-popover.component.html',
  styleUrls: ['./playlist-popover.component.scss'],
})
export class PlaylistPopoverComponent implements OnInit {
  @Input() music: Musique;

  playlists$: Observable<Playlist[]> = EMPTY;

  constructor(private playlistService:PlaylistService,private popoverController:PopoverController,private toastController:ToastController) { }

  ngOnInit() {
    this.playlists$ = this.playlistService.getAll();
  }

  async dismiss(){
    this.popoverController.dismiss();
  }

  addToPlaylist(playlist:Playlist){
    this.dismiss()
    this.presentToast("Music added to playlist")
  }

  async presentToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"checkmark-outline"
    });
    toast.present();
  }

}
