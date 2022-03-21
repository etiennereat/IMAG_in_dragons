import firebase from "firebase/compat/app";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist';
import { Musique } from '../models/Musique';
import { map, switchMap } from 'rxjs/operators'
import { MusiqueService } from './musique.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: Playlist[];

  constructor(private fs: AngularFirestore, private musiqueService : MusiqueService) {
  }
  
  getAll() : Observable<Playlist[]>{
    return this.fs.collection<Playlist>('playlist').valueChanges({idField:'id'});
  }

  getOne(id: string) : Observable<Playlist>{
    let playlistTmp = this.fs.doc<Playlist>('playlist/'+id).valueChanges({idField:'id'}).pipe(
      switchMap((playlist: Playlist) => {
        return this.fs
          .collection<Musique>(`playlist/${id}/musiques`).valueChanges({idField:'id'}).pipe(
            map( musiques  => {
                return Object.assign(playlist, {musiques: musiques})
              }
            )
          )
        }
      ),
    );

    return playlistTmp;
  }

  addPlaylist(name:string,image?:string) {
    var user = firebase.auth().currentUser
    if(user == null){
      console.error("[ERROR] User non identifié")
    }
    else{
      // Add a new document in collection "playlist"
      this.fs.collection("playlist").doc(name).set({
        nom: name,
        idUserCreateur:user.email,
        canWrite:[],
        canRead:[],
        idImageStorage: image == undefined ? "imagePlaylistDemo.jpeg" : image
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
  }

  removePlaylist(id: string) {
    this.fs.collection("playlist").doc(id).delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  sharePlaylistReadOnly(id:string,email:string){
    // Create a reference to the SF doc.
    var canReadDocRef = this.fs.collection("playlist").doc(id);
    // Atomically add a new region to the "regions" array field.
    canReadDocRef.update({canRead: firebase.firestore.FieldValue.arrayUnion(email)});
  }

  sharePlaylistReadAndWrite(id:string,email:string){
    // Create a reference to the SF doc.
    var canReadDocRef = this.fs.collection("playlist").doc(id);
    // Atomically add a new region to the "regions" array field.
    canReadDocRef.update({canWrite: firebase.firestore.FieldValue.arrayUnion(email)});
  }

  addMusic(playlistId: string, music: Musique) {
    var user = firebase.auth().currentUser
    if(user == null){
      console.error("[ERROR] User non identifié")
    }
    else{
      // Add a new document in collection "playlist"
      this.fs.collection("playlist").doc(playlistId).collection('musiques').doc(music.id).set({
        nom: music.nom,
        idAuteur:music.idAuteur,
        idImageStorage:music.idImageStorage,
        refMusique:"/musiques/"+music.idMusiqueStorage.replace(".mp3","")
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
  }

  removeMusique(playlistId: string, music: Musique) {
    this.fs.collection("playlist").doc(playlistId).collection('musiques').doc(music.id).delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
}
