import { Component, OnInit } from '@angular/core';
import { MusiqueService } from 'src/app/services/musique.service';

@Component({
  selector: 'app-play-music-page',
  templateUrl: './play-music-page.component.html',
  styleUrls: ['./play-music-page.component.scss'],
})
export class PlayMusicPageComponent implements OnInit {

  constructor(private musiqueServ: MusiqueService) { }

  ngOnInit() {}

  playIcon = 'pause';
  playPause() {
    if(this.playIcon == 'pause') {
      this.playIcon = 'play';
      this.musiqueServ.pauseMusique();
    } else {
      this.playIcon = 'pause';
      this.musiqueServ.resumeMusique();
    }
  }
}
