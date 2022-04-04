import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { MusiqueService } from '../services/musique.service';
import { Musique } from '../models/Musique';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('t') tabs: IonTabs;
  selected = 'home';
  progress:number;
  isMusicNull:boolean  
  isOnMusicPage: boolean;
  playIcon:string;
  musique: Musique;
  queueSize:number

  constructor(private musiqueServ: MusiqueService,
    private router:Router) {
    this.musique = musiqueServ.getActualMusiqueInfosubscribable()
    this.playIcon = musiqueServ.getActualStateOfPlayIcon();
  }

  ngOnInit() {
    this.musiqueServ.getCurrentplayicon().subscribe((icon)=>{
      this.playIcon = icon
    })
    this.musiqueServ.getCurrentPlayMusique().subscribe((musique)=>{
      this.musique = musique
    })
    this.musiqueServ.getCurrentmusicProgress().subscribe((progress)=>{
      this.progress = progress
    })
    this.musiqueServ.getQueue().subscribe((data)=>{
      this.queueSize = data.length
    })
    setInterval(() => {
      this.isOnMusicPage = this.router.routerState.snapshot.url.includes("music")
      this.isMusicNull = this.musiqueServ.isNull()
    }, 1000 );
  }

  goToMusic(){
    this.router.navigate(['t/home/tracks/music/'+this.musique.id])
  }

  playPause() {
    if(this.musiqueServ.isNull()){return}
    switch(this.playIcon){
      case 'pause':
        this.musiqueServ.pauseMusique();
        break;
      case 'play' :
        this.musiqueServ.resumeMusique();
        break;
      default:
        //do nothing
        break;
    }
  }
  previous() {
    const position = this.musiqueServ.getPosition()
    //si la musique tourne depuis moins de 5 sec on passe a celle d'avant sinon on la recommence 
    if(Math.floor(position) < 5){
      this.musiqueServ.playPreviousMusique();
    }
    else{
      this.musiqueServ.restartCurrentMusique();
    }  }

  next() {
    this.musiqueServ.playNextMusique();
  }
}