import { Playlist } from './../../models/playlist';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-option-modal',
  templateUrl: './option-modal.component.html',
  styleUrls: ['./option-modal.component.scss'],
})
export class OptionModalComponent implements OnInit {
@Input() playlists:Playlist

  playlistForm: FormControl
  ReadOnly = true

  constructor(private fb: FormBuilder, private playlistService: PlaylistService,
    private modalController: ModalController) {
      this.playlistForm = this.fb.control('',[Validators.required, Validators.email]);
  }

  ngOnInit() { 
  }

  dismiss(){
    this.modalController.dismiss()
  }

  sharePlaylist(){
    if(this.ReadOnly == true){
      this.playlistService.sharePlaylistReadOnly(this.playlists.id,this.playlistForm.value)
    }
    else{
      this.playlistService.sharePlaylistReadAndWrite(this.playlists.id,this.playlistForm.value)
    }
  }

}
