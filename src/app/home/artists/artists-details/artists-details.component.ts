import { MusiqueService } from 'src/app/services/musique.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Musique } from 'src/app/models/Musique';
import { ArtistsService } from 'src/app/services/artists.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private musicService:MusiqueService) { }

  ngOnInit() {
    this.musics$ = this.artistsService.getAllMusicsFromArtist(this.route.snapshot.params.id);
  }

  disconnect(){
    this.authService.disconnect();
  }

  playMusique(musique:Musique){
    this.musicService.playMusique(musique);
  }

}
