import { Component, OnInit } from '@angular/core';
import { MusiqueService } from 'src/app/services/musique.service';

@Component({
  selector: 'app-play-music-page',
  templateUrl: './play-music-page.component.html',
  styleUrls: ['./play-music-page.component.scss'],
})
export class PlayMusicPageComponent implements OnInit {
  playIcon:string;

  constructor(private musiqueServ: MusiqueService) { }

  ngOnInit() {
    this.musiqueServ.getCurrentplayicon().subscribe((icon)=>{
      this.playIcon = icon
    })
  }

  playPause() {
    if(this.musiqueServ.isNull()){return}
    if(this.playIcon == 'pause') {
      this.musiqueServ.pauseMusique();
    } else {
      this.musiqueServ.resumeMusique();
    }
  }
  nextMusique(){
    this.musiqueServ.playNextMusique();
  }

  previousMusique(){
    this.musiqueServ.getPosition().then((position) => {
      if(Math.floor(((position/60/60)*60)*60) < 5){
        this.musiqueServ.playPreviousMusique();
      }
      else{
        this.musiqueServ.restartCurrentMusique();
      }
    });
  }
}
