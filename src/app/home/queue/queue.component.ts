import { AlertController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Musique } from 'src/app/models/Musique';
import { Component, OnInit } from '@angular/core';
import { MusiqueService } from 'src/app/services/musique.service';

import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  Queue:Array<Musique>
  QueueMode:boolean = true
  indiceCurrentMusique : number = -1;

  private accelHandler: PluginListenerHandle;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  private subscription:any;

  constructor(private musicService:MusiqueService,
    private authService:AuthService,
    private alertController:AlertController,
    private router:Router) { }

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

  playMusique(indiceInQueue: number){
    this.musicService.playMusiqueInQueue(indiceInQueue)
  }

  disconnect(){
    this.authService.disconnect()
  }

  async ionViewWillEnter() {
    this.accelHandler = await Motion.addListener('accel', event => {
      if(this.router.routerState.snapshot.url.includes("queue")){
        if(!this.lastX) {
          this.lastX = event.acceleration.x;
          this.lastY = event.acceleration.y;
          this.lastZ = event.acceleration.z;
          return;
        }

        let deltaX:number, deltaY:number, deltaZ:number;
        deltaX = Math.abs(event.acceleration.x-this.lastX);
        deltaY = Math.abs(event.acceleration.y-this.lastY);
        deltaZ = Math.abs(event.acceleration.z-this.lastZ);
        if(deltaX + deltaY + deltaZ > 10) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }

        if(this.moveCounter > 1) { 
          this.moveCounter=0;
          this.shuffleQueue();
        }

        this.lastX = event.acceleration.x;
        this.lastY = event.acceleration.y;
        this.lastZ = event.acceleration.z;
      }
    });

  }

  ionViewWillLeave() {
    // Stop the acceleration listener
    const stopAcceleration = () => {
      if (this.accelHandler) {
        this.accelHandler.remove();
        Motion.removeAllListeners();
      }
    };
  }

}
