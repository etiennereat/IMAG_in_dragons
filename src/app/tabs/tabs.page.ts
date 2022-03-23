import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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


  constructor(private musiqueServ: MusiqueService,public auth: AngularFireAuth, private router:Router) {
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
    this.musiqueServ.getCurrentmsucProgress().subscribe((progress)=>{
      this.progress = progress
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
    if(this.playIcon == 'pause') {
      this.musiqueServ.pauseMusique();
    } else {
      this.musiqueServ.resumeMusique();
    }
  }
  // setSelectedTab() {
  //   this.selected = this.tabs.getSelected();
  // }
}