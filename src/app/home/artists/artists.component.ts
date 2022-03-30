import { Router } from '@angular/router';
import { ArtistsService } from './../../services/artists.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Artists } from 'src/app/models/artists';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit {

  artists$: Observable<Artists[]> = EMPTY;

  constructor(private authService:AuthService,
    private artistsService:ArtistsService,
    private router:Router) { }

  ngOnInit() {
    this.artists$ = this.artistsService.getAllArtists();
  }

  disconnect(){
    this.authService.disconnect();
  }
}
