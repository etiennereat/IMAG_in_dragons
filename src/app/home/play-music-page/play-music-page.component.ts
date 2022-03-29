import { AuthService } from './../../services/auth.service';
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
  progress:number;
  audioDuration:string;
  currentTime:string;
  audioDurationInS: number;
  musique: Musique;

  constructor(private musiqueServ: MusiqueService,
    private authService:AuthService) {
    //set musique 
    this.musique = musiqueServ.getActualMusiqueInfosubscribable();
    this.playIcon = musiqueServ.getActualStateOfPlayIcon();
  }

  ngOnInit() {
    this.audioDuration = "--:--"
    this.currentTime = "--:--"
    this.musiqueServ.getCurrentplayicon().subscribe((icon)=>{
      this.playIcon = icon
    })
    this.musiqueServ.getCurrentmusicCurrentTime().subscribe((position)=>{
      this.currentTime = this.sToTime(position)
    })
    this.musiqueServ.getCurrentmusicTimeDuration().subscribe((duration)=>{
      this.audioDurationInS = duration
      this.audioDuration = this.sToTime(duration)
    })
    this.musiqueServ.getCurrentmusicProgress().subscribe((progress)=>{
      this.progress = progress
    })
    this.musiqueServ.getCurrentPlayMusique().subscribe((musique)=>{
      this.musique = musique
    })
  }

  seekTo(value:number){
    var currentPosition = value*(this.audioDurationInS/100)
    this.musiqueServ.seekTo(currentPosition*1000)
  }

  sToTime(duration:number){
    var minutes = Math.floor(duration/60)
    var seconds = Math.floor(duration-(minutes*60))
    const fomarttedTime = [
      minutes.toString().padStart(2,"0"),
      seconds.toString().padStart(2,"0")
    ].join(":");
    return fomarttedTime;
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

  disconnect(){
    this.authService.disconnect()
  }
}
