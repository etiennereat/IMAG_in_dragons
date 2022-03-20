import { Component, OnInit } from '@angular/core';
import { Musique } from 'src/app/models/Musique';
import { MusiqueService } from 'src/app/services/musique.service';

@Component({
  selector: 'app-play-music-page',
  templateUrl: './play-music-page.component.html',
  styleUrls: ['./play-music-page.component.scss'],
})
export class PlayMusicPageComponent implements OnInit {
  playIcon:string;
  musique: Musique;

  constructor(private musiqueServ: MusiqueService) {
    //set musique 
    this.musique = new Musique("loading", "loading", "loading", "loading")
  }

  ngOnInit() {
    this.musiqueServ.getCurrentplayicon().subscribe((icon)=>{
      this.playIcon = icon
    })
    this.musiqueServ.getCurrentPlayMusique().subscribe((musique)=>{
      console.log(musique)
      this.musique = musique
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
      //si la musique tourne depuis moins de 5 sec on passe a celle d'avant sinon on la recommence 
      if(Math.floor(((position/60/60)*60)*60) < 5){
        this.musiqueServ.playPreviousMusique();
      }
      else{
        this.musiqueServ.restartCurrentMusique();
      }
    });
  }
}
