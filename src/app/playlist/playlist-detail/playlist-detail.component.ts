import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateTodoComponent } from 'src/app/modals/create-todo/create-todo.component';
import { Playlist } from 'src/app/models/playlist';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {

  public playlist: Playlist;

  constructor(private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private modalController: ModalController) { }

  ngOnInit(): void {
    this.playlist = this.playlistService.getOne(+this.route.snapshot.params.id);
  }

  delete(todo: Todo) {
    this.playlistService.removeTodo(this.playlist.id, todo);
    this.playlist = this.playlistService.getOne(+this.route.snapshot.params.id);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      componentProps: {
        playlistId: this.playlist.id
      }
    });
    await modal.present();
    this.playlist = this.playlistService.getOne(+this.route.snapshot.params.id);
  }

}
