import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EMPTY, Observable } from 'rxjs';
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
    private authService:AuthService) { }
 

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

  disconnect(){
    this.authService.disconnect()
  }

}
