import { Router } from '@angular/router';
import { Musique } from 'src/app/models/Musique';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-music-popover',
  templateUrl: './music-popover.component.html',
  styleUrls: ['./music-popover.component.scss'],
})


export class MusicPopoverComponent implements OnInit {
  @Input() musics: Musique;

  inPlaylist:boolean
  constructor(private router:Router) { }

  ngOnInit() {
    this.inPlaylist = this.router.routerState.snapshot.url.includes("playlist")
  }

}
