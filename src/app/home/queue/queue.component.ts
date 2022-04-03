import { AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Musique } from 'src/app/models/Musique';
import { Component, OnInit } from '@angular/core';
import { MusiqueService } from 'src/app/services/musique.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  Queue:Array<Musique>
  QueueMode:boolean = true
  indiceCurrentMusique : number = -1;

  constructor(private musicService:MusiqueService,
    private authService:AuthService,
    private alertController:AlertController) { }

  ngOnInit() {
    this.Queue = this.musicService.getQueueMusique()
    this.musicService.getQueueMode().subscribe(mode => {
      switch(mode){
        case 1:
          this.QueueMode = false
          break;
        case 0:
          this.QueueMode = true
          break;
        default:
          this.QueueMode = false   
      }
    })
    this.indiceCurrentMusique = this.musicService.getIndiceCurrentMusiquePlay()
    this.musicService.getIndiceCurrentMusiquePlaySubscribable().subscribe(indice => {
      this.indiceCurrentMusique = indice;
    })
      
    this.musicService.getQueue().subscribe((data)=>{
      this.Queue=data
    })
  }

  shuffleQueue(){
    this.musicService.shuffleQueue()
  }

  changeQueueMode(){
    switch(this.QueueMode){
      case true:
        this.musicService.setQueueMode(0)
        break;
      case false:
        this.musicService.setQueueMode(1)
        break;
      default:    
    }
  }

  removeFromQueue(index:number){
    this.musicService.removeFromQueue(index)
  }

  clearQueue(){
    this.presentAlertConfirm()
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Clear Queue',
      message: "Are you sure you want to delete the queue ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: () => {
            this.musicService.clearQueue()
          }
        }
      ]
    });
    await alert.present();
  }

  playMusique(musiqueLite: Musique){
    var nb = 0
    this.musicService.getMusique(musiqueLite.id).subscribe(res => {
      if(nb == 0){
        this.musicService.playMusique(res);
        nb=1
      }
    })
  }

  disconnect(){
    this.authService.disconnect()
  }

}
