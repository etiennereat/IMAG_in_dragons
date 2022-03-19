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

  constructor(private musiqueService:MusiqueService,
    private popoverController:PopoverController) { }
  musics$: Observable<Musique[]> = EMPTY;

  ngOnInit(): void {
    this.musics$ = this.musiqueService.getAllMusique();
  }

  playMusique(musiqueLite: Musique){
    var musique$ = this.musiqueService.getMusique(musiqueLite.id);
    musique$.subscribe(res => {
      this.musiqueService.playMusique(res);
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

}
