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
  
  private storageMusiqueRef;
  private storageImageRef;
  private currentMusique : MediaObject;
  public currentMusiqueInfo: Musique;
  private playIcon = new Subject<string>();

  constructor(private afs: AngularFirestore, private media: Media) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('Images');
  }


  getCurrentplayicon():Subject<string>{
    return this.playIcon
  }

   playMusique(musique: Musique) : Boolean{      
      this.currentMusiqueInfo = musique;
      // [START storage_download_full_example]
      // Create a reference to the file we want to download
      // if(this.currentMusique==null){
      //   console.log(this.media.MEDIA_RUNNING)
      //   return true
      // }
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
      // Get the download URL
      return starsRef.getDownloadURL()
      .then((url) => {
        this.currentMusique = this.media.create(url);
        this.currentMusique.play();
        this.playIcon.next("pause")
        return true;
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
        return false;
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
}
