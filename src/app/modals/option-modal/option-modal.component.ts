import { Playlist } from './../../models/playlist';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-option-modal',
  templateUrl: './option-modal.component.html',
  styleUrls: ['./option-modal.component.scss'],
})
export class OptionModalComponent implements OnInit {
@Input() playlists:Playlist

  playlistForm: FormControl
  ReadOnly = "ReadOnly"

  constructor(private fb: FormBuilder,
    private playlistService: PlaylistService,
    private modalController: ModalController,
    private toastController: ToastController) {
      this.playlistForm = this.fb.control('',[Validators.required, Validators.email]);
  }

  ngOnInit() { 
  }

  dismiss(){
    this.modalController.dismiss()
  }

  changeMode(){
    this.ReadOnly == "ReadOnly" ? "ReadAndWrite" : "ReadOnly"
  }

  sharePlaylist(){
    if(this.ReadOnly == "ReadOnly"){
      this.playlistService.sharePlaylistReadOnly(this.playlists.id,this.playlistForm.value)
    }
    else{
      this.playlistService.sharePlaylistReadAndWrite(this.playlists.id,this.playlistForm.value)
    }
    this.dismiss()
    this.presentToast("Successfully shared playlist")
  }

  async presentToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"checkmark-outline"
    });
    toast.present();
  }

}
