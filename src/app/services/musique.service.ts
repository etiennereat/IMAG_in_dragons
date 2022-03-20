import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Musique } from '../models/Musique';
import { Observable, Subject } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Injectable({
  providedIn: 'root'
})
export class MusiqueService {
  
  storageMusiqueRef : firebase.storage.Reference;
  storageImageRef : firebase.storage.Reference;
  private currentMusique : MediaObject;
  public indiceCurrentMusiquePlay: number;
  private playIcon = new Subject<string>();
  private musicTimeDuration = new Subject<number>();
  private musicProgress = new Subject<number>();
  private musicCurrrentTime = new Subject<number>();
  private musiqueInfoSubscibable = new Subject<Musique>();
  private currentMusiqueQueue: Musique[];
  private state : number; //0 play classique / 1 repet queue / 2 repet track
  private progress:number;

  constructor(private afs: AngularFirestore, private media: Media) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('images');
    this.currentMusiqueQueue = new Array<Musique>();
    this.state = 1;
    setInterval(() => {
      if(!this.isNull()){
        this.getPosition().then((position) => {
          var audioDuration = Math.floor(this.getDuration());
          this.musicTimeDuration.next(audioDuration)
          var currentPosition = Math.floor(position);
          this.musicCurrrentTime.next(currentPosition)
          this.progress = (currentPosition / audioDuration) * 100
          this.musicProgress.next(this.progress)
          if(this.progress == 100){
            this.playNextMusique();
          }
        });
      }
    }, 500 );
  }

  //reset queue by the only musique 
  playMusique(musique: Musique){    
    //if same musique do nothing exept resume musique     
      if(this.indiceCurrentMusiquePlay != null && this.currentMusiqueQueue[this.indiceCurrentMusiquePlay].id == musique.id){
        //resume current musique
        this.resumeMusique();
        this.musiqueInfoSubscibable.next(musique)
      }
      //else reset queue by this only one music
      else{
        if(this.currentMusique !=null){
          this.stopMusique();
        }
        this.indiceCurrentMusiquePlay = 0;
        this.currentMusiqueQueue = new Array<Musique>();
        this.currentMusiqueQueue.push(musique)
        this.startMusique(musique);
      }      
    }


    addToQueue(musique:Musique){
      this.currentMusiqueQueue.push(musique);
      if(this.currentMusique == null){
        if(this.indiceCurrentMusiquePlay == null){
          this.playMusique(musique);
        }
        else{
          this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay + 1;
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
        }
      }
    }

    addListToQueue(musiqueList:Musique[]){
      for (var index = 0; index < musiqueList.length; index++) {
        this.currentMusiqueQueue.push(musiqueList[index]);
      }
    }

    playNextMusique(){
      switch(this.state){
        case 0 :
          if(this.indiceCurrentMusiquePlay + 1 == this.currentMusiqueQueue.length){
            //do nothing end of the queue
            this.stopMusique();
          }
          else{
            this.stopMusique();
            this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay + 1;
            this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          }
          break;
        case 1 :
            this.stopMusique();
            this.indiceCurrentMusiquePlay = (this.indiceCurrentMusiquePlay + 1) % this.currentMusiqueQueue.length;
            this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
            break;
        case 2 :
            this.restartCurrentMusique();
            break;
        }
    }

    playPreviousMusique(){
      switch(this.state){
        case 0 :
            if(this.indiceCurrentMusiquePlay != 0){
              this.stopMusique();
              this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay - 1;
              this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
            }
            else{
              this.restartCurrentMusique();
            }
          break;
        case 1 :
        case 2 :
          if(this.indiceCurrentMusiquePlay == 0){
            this.indiceCurrentMusiquePlay = this.currentMusiqueQueue.length - 1;
          } 
          else{
            this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay - 1;
          }
          this.stopMusique();
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          break;
        }
    }

    startMusique(musique:Musique){
      //si on a deja download l'url on le recup direct 
      if(musique.urlMusique != null){
        this.currentMusique = this.media.create(musique.urlMusique);
        this.currentMusique.play();
        this.playIcon.next("pause");
        this.musiqueInfoSubscibable.next(musique)
      }
      else{
        var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
        // Get the download URL
        starsRef.getDownloadURL()
        .then((url) => {
          musique.urlMusique = url;
          this.currentMusique = this.media.create(url);
          this.currentMusique.play();
          this.playIcon.next("pause")
          this.musiqueInfoSubscibable.next(musique)
        })
        .catch((error) => {
          switch (error.code) {
            case 'storage/object-not-found':
                console.error("File doesn't exist")
              break;
            case 'storage/unauthorized':
                console.error("User doesn't have permission to access the object");
              break;
            case 'storage/canceled':
                console.error("User canceled the upload")
              break;
    
            // ...
    
            case 'storage/unknown':
                console.error("Unknown error occurred, inspect the server response")
              break;
          }
          if(this.state != 2){
            this.playNextMusique();
          }
        });
      }
    }

    restartCurrentMusique(){
      this.currentMusique.pause()
      this.currentMusique.getCurrentPosition().then(res=>{
        this.currentMusique.seekTo(res);
        this.currentMusique.play();
      });
    }

    pauseMusique(){
      this.currentMusique.pause();
      this.playIcon.next("play")
    }
    
    stopMusique(){
      this.currentMusique.stop();
      this.currentMusique.release();
      this.currentMusique = null;
    }

    resumeMusique(){
      this.currentMusique.play();
      this.playIcon.next("pause")
    }

    isNull(){
      return this.currentMusique == null;
    }
  
    getDuration(){
      return Math.floor(this.currentMusique.getDuration());
    }
  
    getPosition(){
      return this.currentMusique.getCurrentPosition()
    }
  
    getCurrentmusicTimeDuration():Subject<number>{
    return this.musicTimeDuration
    }

    getCurrentmusicCurrentTime():Subject<number>{
      return this.musicCurrrentTime
    }

    getCurrentmsucProgress():Subject<number>{
      return this.musicProgress
    }
  
    seekTo(time:number){
      this.currentMusique.seekTo(time);
    }
      
    getMusique(idMusique: string) :Observable<Musique>{
      return this.afs.doc<Musique>('musique/'+idMusique).valueChanges({idField:'id'});
    }

    getAllMusique():Observable<Musique[]>{ 
      return this.afs.collection<Musique>('musique').valueChanges({idField:'id'});
    }
    
    getCurrentplayicon():Subject<string>{
      return this.playIcon
    }
  
    getMusiqueUrl(musique: Musique){
        var starsRef = this.storageImageRef.child(musique.idImageStorage);
        starsRef.getDownloadURL().then(res => {
            musique.urlImage = res;
        });
    }

    getCurrentPlayMusique(): Subject<Musique>{
      console.log(this.musiqueInfoSubscibable)
      return this.musiqueInfoSubscibable;
    }
    
    addMusiqueToFirestore(musique :Musique, pathMusique:string, pathImage?:string){
      //I)need to load the musique file 

      //II)need to get Date + load metadata to complete musique (to do this great exemple -> https://codepen.io/codefoxx/pen/OJmGrzG)

      //III)if presente load Image or set default image 

      //IV)upload musique file in storage

      //V)if presente upload image file in storage

      //VI)Add auteur document to firestore 

      //VII)Add musique document to firestore 

    }
}
