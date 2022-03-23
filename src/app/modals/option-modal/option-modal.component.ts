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
    if(this.playlistForm.value == this.playlists.idUserCreateur){
      this.presentErrorToast("Can't share the playlist with the owner")
      return
    }
    if((this.playlists.canRead.includes(this.playlistForm.value) && this.ReadOnly == "ReadOnly") ||
       (this.playlists.canWrite.includes(this.playlistForm.value) && this.ReadOnly != "ReadOnly")){
      this.presentErrorToast("Already shared this playlist in the same mode")
      return
    }
    var text:string = "Successfully shared playlist"
    if(this.ReadOnly == "ReadOnly"){
      if(this.playlists.canWrite.includes(this.playlistForm.value)){
        this.playlistService.unSharePlaylistReadAndWrite(this.playlists.id,this.playlistForm.value)
        text="Changed share mode to read only"
      }
      this.playlistService.sharePlaylistReadOnly(this.playlists.id,this.playlistForm.value)
    }
    else{
      if(this.playlists.canRead.includes(this.playlistForm.value)){
        this.playlistService.unSharePlaylistReadOnly(this.playlists.id,this.playlistForm.value)
        text="Changed share mode to read and write"
      }
      this.playlistService.sharePlaylistReadAndWrite(this.playlists.id,this.playlistForm.value)
    }
    this.dismiss()
    this.presentToast(text)
  }

  async presentToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"checkmark-outline"
    });
    toast.present();
  }

  async presentErrorToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"close-outline"
    });
    toast.present();
  }

}
