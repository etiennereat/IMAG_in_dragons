import { Injectable } from '@angular/core';
import { AngularFirestore, Reference } from '@angular/fire/compat/firestore';
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
  public currentMusiqueInfo: Musique;
  private playIcon = new Subject<string>();

  constructor(private afs: AngularFirestore, private media: Media) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('images');
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

  playMusique(musique: Musique){         
      // [START storage_download_full_example]
      // Create a reference to the file we want to download
      if(this.currentMusique!=null){
        if(this.currentMusiqueInfo.id == musique.id){
          //resume current musique
          this.resumeMusique(); 
          return;
        }
        else{
          this.stopMusique();
        }
      }
      this.currentMusiqueInfo = musique;
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
      // Get the download URL
      starsRef.getDownloadURL()
      .then((url) => {
        this.currentMusique = this.media.create(url);
        this.currentMusique.play();
        this.playIcon.next("pause")
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
        this.currentMusiqueInfo = null;
      });
    } 

    pauseMusique(){
      this.currentMusique.pause();
      this.playIcon.next("play")
    }
    
    stopMusique(){
      this.currentMusique.stop();
      this.currentMusique.release();
      this.currentMusiqueInfo = null;
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
      
    getMusique(idMusique: string) :Observable<Musique>{
        return this.afs.doc<Musique>('musique/'+idMusique).valueChanges({idField:'id'});
    }

    getAllMusique():Observable<Musique[]>{ 
      return this.afs.collection<Musique>('musique').valueChanges({idField:'id'});
    }
}
