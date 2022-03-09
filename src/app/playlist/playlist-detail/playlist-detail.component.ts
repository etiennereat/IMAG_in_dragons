import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateMusiqueComponent } from 'src/app/modals/create-musique/create-musique.component';
import { Playlist } from 'src/app/models/playlist';
import { Musique } from 'src/app/models/Musique';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist$: Observable<Playlist>;

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private modalController: ModalController) { }

  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    this.playlist$.subscribe(res => {
      console.log(res)
    })
  }

  delete(musique: Musique) {
    this.playlist$.subscribe(res => {
      this.playlistService.removeMusique(res.id, musique);
      this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    })
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateMusiqueComponent,
      componentProps: {
        playlistId: "playlistDemo"
      }
    });
    await modal.present();
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
  }

}
