import { Component, OnInit } from '@angular/core';
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

  constructor(private musiqueServ: MusiqueService) { }

  ngOnInit() {
    this.musiqueServ.getCurrentplayicon().subscribe((icon)=>{
      this.playIcon = icon
    })
    this.musiqueServ.getCurrentmusicCurrentTime().subscribe((position)=>{
      this.currentTime = this.sToTime(position)
    })
    this.musiqueServ.getCurrentmusicTimeDuration().subscribe((duration)=>{
      this.audioDuration = this.sToTime(duration)
    })
    this.musiqueServ.getCurrentmsucProgress().subscribe((progress)=>{
      this.progress = progress
    })
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
      if(Math.floor(((position/60/60)*60)*60) < 5){
        this.musiqueServ.playPreviousMusique();
      }
      else{
        this.musiqueServ.restartCurrentMusique();
      }
    });
  }
}
