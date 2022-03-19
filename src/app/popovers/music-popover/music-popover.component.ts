import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Musique } from 'src/app/models/Musique';
import { Component, OnInit, Input } from '@angular/core';
import { PlaylistPopoverComponent } from '../playlist-popover/playlist-popover.component';

@Component({
  selector: 'app-music-popover',
  templateUrl: './music-popover.component.html',
  styleUrls: ['./music-popover.component.scss'],
})


export class MusicPopoverComponent implements OnInit {
  @Input() musics: Musique;

  inPlaylist:boolean
  constructor(private router:Router,private popoverController:PopoverController) { }

  ngOnInit() {
    this.inPlaylist = this.router.routerState.snapshot.url.includes("playlist")
  }

  async openPlaylistPopover(ev:any){
    const popover = await this.popoverController.create({
      component: PlaylistPopoverComponent,
      event:ev,
      translucent: true
    });
    return await popover.present()
  }

}
