import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateMusiqueComponent } from 'src/app/modals/create-musique/create-musique.component';
import { Playlist } from 'src/app/models/playlist';
import { Musique } from 'src/app/models/Musique';
import { PlaylistService } from 'src/app/services/playlist.service';
import { MusiqueService } from 'src/app/services/musique.service';
import { MusicPopoverComponent } from 'src/app/popovers/music-popover/music-popover.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist$: Observable<Playlist>;
  canRemove: boolean = false;

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private musiqueService: MusiqueService,
    private modalController: ModalController,
    private popoverController:PopoverController,
    private authService:AuthService) { }

  ngOnInit(): void {
    this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    this.checkRight();
  }

  delete(musique: Musique) {
    this.playlist$.subscribe(res => {
      this.playlistService.removeMusique(res.id, musique);
      this.playlist$ = this.playlistService.getOne(this.route.snapshot.params.id);
    })
  }

  playMusique(musiqueLite: Musique){
    var passage = 0;
    this.playlist$.subscribe((playlist)=>{
      playlist.musiques.subscribe(musiques=>{
        if(passage == 0){
          for(let i = 0; i < musiques.length; i++){
            if(musiques[i].id == musiqueLite.id){
              this.musiqueService.playPlaylist(musiques,i)
            }
          }
          passage = 1
        }
      })
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

  async openPopover(ev:any,music:Musique,playlist:Playlist){
    const popover = await this.popoverController.create({
      component: MusicPopoverComponent,
      event:ev,
      componentProps: {
        musics: music,
        playlists: playlist
      },
      translucent: true
    });
    return await popover.present()
  }

  playThisShuffuledPlaylist(){
    var passage = 0;
    this.playlist$.subscribe((playlist)=>{
      playlist.musiques.subscribe(musiques=>{
        if(passage == 0){
          this.musiqueService.playPlaylist(this.shuffle(musiques),0)
          passage = 1
        }
      })
    })
  }

  shuffle(list) {
    let currentIndex: number = list.length;
    let randomIndex: number;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
    }
    return list;
  }

  playThisPlaylist(){
    var passage = 0;
    this.playlist$.subscribe((playlist)=>{
      playlist.musiques.subscribe(musiques=>{
        if(passage == 0){
          this.musiqueService.playPlaylist(musiques,0)
          passage = 1
        }
      })
    })
  }

  disconnect(){
    this.playlist$ = null;
    this.authService.disconnect()
  }

  checkRight(){
     this.authService.getCurrentUser().then(res=>{
       this.playlist$.subscribe(playlist=>{
        this.canRemove = playlist.canWrite.includes(res.email) || playlist.idUserCreateur == res.email;
      })
    })
  }
}
