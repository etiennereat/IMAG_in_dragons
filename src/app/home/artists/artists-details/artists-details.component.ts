import { PopoverController } from '@ionic/angular';
import { MusiqueService } from 'src/app/services/musique.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Musique } from 'src/app/models/Musique';
import { ArtistsService } from 'src/app/services/artists.service';
import { AuthService } from 'src/app/services/auth.service';
import { MusicPopoverComponent } from 'src/app/popovers/music-popover/music-popover.component';

@Component({
  selector: 'app-artists-details',
  templateUrl: './artists-details.component.html',
  styleUrls: ['./artists-details.component.scss'],
})
export class ArtistsDetailsComponent implements OnInit {

  musics$: Observable<Musique[]> = EMPTY;

  constructor(private authService:AuthService,
    private artistsService:ArtistsService,
    private route: ActivatedRoute,
    private musicService:MusiqueService,
    private popoverController:PopoverController) { }

  ngOnInit() {
    this.musics$ = this.artistsService.getAllMusicsFromArtist(this.route.snapshot.params.id);
  }

  disconnect(){
    this.authService.disconnect();
  }

  playMusique(musique:Musique){
    this.musicService.playMusique(musique);
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
