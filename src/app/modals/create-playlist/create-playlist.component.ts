import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Playlist } from 'src/app/models/playlist';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss'],
})
export class CreatePlaylistComponent implements OnInit {

  playlistForm: FormGroup

  constructor(private fb: FormBuilder, private playlistService: PlaylistService,
    private modalController: ModalController) {
    this.playlistForm = this.fb.group({ name: ['', [Validators.required, Validators.minLength(3)]] });
  }

  ngOnInit() { }

  addPlaylist() {
    this.playlistService.addPlaylist(new Playlist(this.playlistForm.get('name').value));
    this.modalController.dismiss();
  }

}
