import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { IPicture } from 'music-metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  storageImageRef : firebase.storage.Reference;

  constructor(    private angularFireStorage: AngularFireStorage
    ) {
    this.storageImageRef = firebase.storage().ref('images');
  }

  public uploadImageToFirebase(fileName : string, cover : IPicture) : AngularFireUploadTask {
    var metadata = {
      contentType : "image/jpeg"
    }
    let imagePathStorage = `${new Date().getTime()}_${fileName.split('.')[0].concat(".jpeg")}`;
    return this.angularFireStorage.upload("images/"+imagePathStorage, cover.data, metadata);
  }

  public getImageUrl(imagePathStorage : string) : Promise<string> {
    return this.storageImageRef.child(imagePathStorage).getDownloadURL()
  }

  public storeInCache(urlFirebase : string) : string {
    return "todo";
  }

  public tryToGetImagePathFromCache(id : string) : string {
    return "todo";
  }

}
