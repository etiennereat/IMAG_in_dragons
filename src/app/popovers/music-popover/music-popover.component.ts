import { PlaylistService } from 'src/app/services/playlist.service';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Musique } from 'src/app/models/Musique';
import { Component, OnInit, Input } from '@angular/core';
import { PlaylistPopoverComponent } from '../playlist-popover/playlist-popover.component';
import { MusiqueService } from 'src/app/services/musique.service';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-music-popover',
  templateUrl: './music-popover.component.html',
  styleUrls: ['./music-popover.component.scss'],
})


export class MusicPopoverComponent implements OnInit {
  @Input() musics: Musique;
  @Input() playlists: Playlist;

  inPlaylist:boolean
  constructor(private router:Router,
    private popoverController:PopoverController,
    private musiqueService:MusiqueService,
    private toastController: ToastController,
    private playlistService:PlaylistService) { }

  ngOnInit() {
    this.inPlaylist = this.router.routerState.snapshot.url.includes("playlist")
  }

  async openPlaylistPopover(ev:any){
    const popover = await this.popoverController.create({
      component: PlaylistPopoverComponent,
      event:ev,
      componentProps: {
        music: this.musics
      },
      translucent: true
    });
    return await popover.present()
  }

  async dismiss(){
    this.popoverController.dismiss();
  }

  async presentToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"checkmark-outline"
    });
    this.dismiss()
    toast.present();
  }

  addToQueue(){
    this.musiqueService.addToQueue(this.musics)
    this.dismiss()
    this.presentToast("Music added to queue")
  }

  deleteFromPlaylist(){
    this.dismiss()
    this.playlistService.removeMusique(this.playlists.id,this.musics)
    this.presentToast("Music deleted from playlist")
  }

}
