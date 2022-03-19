import { PlaylistService } from 'src/app/services/playlist.service';
import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Playlist } from 'src/app/models/playlist';

@Component({
  selector: 'app-playlist-popover',
  templateUrl: './playlist-popover.component.html',
  styleUrls: ['./playlist-popover.component.scss'],
})
export class PlaylistPopoverComponent implements OnInit {

  playlists$: Observable<Playlist[]> = EMPTY;

  constructor(private playlistService:PlaylistService) { }

  ngOnInit() {
    this.playlists$ = this.playlistService.getAll();
  }

}
