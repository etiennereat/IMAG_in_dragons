import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, PopoverController } from '@ionic/angular';
import { EMPTY, Observable } from 'rxjs';
import { AddMusiqueComponent } from 'src/app/modals/add-musique/add-musique.component';
import { Musique } from 'src/app/models/Musique';
import { MusicPopoverComponent } from 'src/app/popovers/music-popover/music-popover.component';
import { MusiqueService } from 'src/app/services/musique.service';
import { first } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-morceaux',
  templateUrl: './morceaux.component.html',
  styleUrls: ['./morceaux.component.scss'],
})
export class MorceauxComponent implements OnInit {
@ViewChild('search', {static: false}) search:IonSearchbar;  
  
  musics$: Observable<Musique[]> = EMPTY;
  searchedItem:any;
  user$ : Promise<firebase.User>;

  constructor(private musiqueService:MusiqueService,
    private popoverController:PopoverController,
    private modalController: ModalController,
    private authService:AuthService) { }

  ngOnInit(): void {
    this.musics$ = this.musiqueService.getAllMusique();
    this.musics$.subscribe((musics) =>{
      this.searchedItem = musics
    })
    this.user$ = this.authService.getCurrentUser();
  }

  _ionChange(ev:any){
    const val = ev.target.value;
    this.musics$.subscribe((musics) =>{
      this.searchedItem = musics
      if(val && val.trim() !=''){
        this.searchedItem = this.searchedItem.filter((item:any)=>{
          return (item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.idAuteur.toLowerCase().indexOf(val.toLowerCase()) > -1)
        })
      }
    })
    
  }

  playMusique(musiqueLite: Musique){
    var passage = 0;
    this.musiqueService.getMusique(musiqueLite.id).subscribe(res => {
      if(passage == 0){
        this.musiqueService.playMusique(res);
        passage = 1;
      }
    })
  }

  async openPopover(ev:any,music:Musique){
    const popover = await this.popoverController.create({
      component: MusicPopoverComponent,
      event:ev,
      componentProps: {
        musics: music
      },
      translucent: true
    });
    return await popover.present()
  }

  async openModal(){
    const modal = await this.modalController.create({
      component : AddMusiqueComponent,
      initialBreakpoint : 0.2
    })
    await modal.present();
  }
  
  disconnect(){
    this.authService.disconnect()
  }

}
