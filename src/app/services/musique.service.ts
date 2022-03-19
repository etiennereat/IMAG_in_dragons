import { Injectable } from '@angular/core';
import { AngularFirestore, Reference } from '@angular/fire/compat/firestore';
import { Musique } from '../models/Musique';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class MusiqueService {
  
  storageMusiqueRef : firebase.storage.Reference;
  storageImageRef : firebase.storage.Reference;
  currentMusique : MediaObject;

  constructor(private afs: AngularFirestore, private media: Media) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('images');
  }

    
  getMusique(idMusique: string) :Observable<Musique>{
      return this.afs.doc<Musique>('musique/'+idMusique).valueChanges({idField:'id'});
  }

  getMusiqueUrl(musique: Musique): Promise<string>{
      var starsRef = this.storageImageRef.child(musique.idImageStorage);
      return starsRef.getDownloadURL();

  }

  playMusique(musique: Musique) : Promise<Boolean>{      
      // [START storage_download_full_example]
      // Create a reference to the file we want to download
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
  
      // Get the download URL
      return starsRef.getDownloadURL()
      .then((url) => {
        this.currentMusique = this.media.create(url);
        this.currentMusique.play();
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
        return false;
      });
    } 

    pauseMusique(){
      this.currentMusique.pause();
    }
    
    stopMusique(){
      this.currentMusique.stop();
      this.currentMusique.release();
    }

    resumeMusique(){
      this.currentMusique.play();
    }
}
