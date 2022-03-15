import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Musique } from '../models/Musique';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class MusiqueService {
  storageMusiqueRef;
  storageImageRef;
  constructor(private afs: AngularFirestore) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('Images');


  }

    
  getMusique(idMusique: string) :Observable<Musique>{
      return this.afs.doc<Musique>('musique/'+idMusique).valueChanges({idField:'id'});
  }

  

  playMusique(musique: Musique){
 


      // [START storage_download_full_example]
      // Create a reference to the file we want to download
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
  
      // Get the download URL
      starsRef.getDownloadURL()
      .then((url) => {
         // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
              var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
          console.log(xhr);
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
      });
    } 
}
