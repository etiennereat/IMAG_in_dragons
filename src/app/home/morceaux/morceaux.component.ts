import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { EMPTY, Observable } from 'rxjs';
import { AddMusiqueComponent } from 'src/app/modals/add-musique/add-musique.component';
import { Musique } from 'src/app/models/Musique';
import { MusicPopoverComponent } from 'src/app/popovers/music-popover/music-popover.component';
import { MusiqueService } from 'src/app/services/musique.service';




@Component({
  selector: 'app-morceaux',
  templateUrl: './morceaux.component.html',
  styleUrls: ['./morceaux.component.scss'],
})
export class MorceauxComponent implements OnInit {
  
  musics$: Observable<Musique[]> = EMPTY;
  
  constructor(private musiqueService:MusiqueService,
    private popoverController:PopoverController,
    private modalController: ModalController
    ) {}
   

  ngOnInit(): void {
    this.musics$ = this.musiqueService.getAllMusique();
  }

  playMusique(musiqueLite: Musique){
    var nb = 0
    this.musiqueService.getMusique(musiqueLite.id).subscribe(res => {
      if(nb == 0){
        this.musiqueService.playMusique(res);
        nb=1
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

}
