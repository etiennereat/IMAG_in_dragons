import { AuthService } from './auth.service';
import firebase from "firebase/compat/app";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { Playlist } from '../models/playlist';
import { Musique } from '../models/Musique';
import { map, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  
  playlists: Playlist[];

  constructor(private fs: AngularFirestore,
    private authService:AuthService) {
  }
  
  getAllOwner() : Observable<Playlist[]>{
    var user = firebase.auth().currentUser
    return this.fs.collection<Playlist>('playlist', ref => ref.where('idUserCreateur','==',user.email)).valueChanges({idField:'id'});
  }

  getAllReadOnly() : Observable<Playlist[]>{
    var user = firebase.auth().currentUser
    return this.fs.collection<Playlist>('playlist', ref => ref.where('canRead','array-contains',user.email)).valueChanges({idField:'id'});
  }

  getAllReadAndWrite() : Observable<Playlist[]>{
    var user = firebase.auth().currentUser
    return this.fs.collection<Playlist>('playlist', ref => ref.where('canWrite','array-contains',user.email)).valueChanges({idField:'id'});
  }

  getOne(id: string) : Observable<Playlist>{
    return this.fs.doc<Playlist>('playlist/'+id).valueChanges({idField:'id'}).pipe(
      switchMap((playlist: Playlist) => {
        playlist.musiques = this.getPlaylistMusiques(playlist.id)
          return of (playlist) 
        }
      )
    );
  }

  getPlaylistMusiques(id: string) : Observable<Musique[]>{
    return this.fs.collection<Musique>(`playlist/${id}/musiques`).valueChanges({idField:'id'});
  }

  addPlaylist(name:string,image?:string) {
    this.authService.getCurrentUser().then(user =>{
      if(user == null){
        console.error("[ERROR] User non identifié")
      }
      else{
        // Add a new document in collection "playlist"
        this.fs.collection("playlist").doc().set({
          nom:name,
          idUserCreateur:user.email,
          canWrite:[],
          canRead:[],
          idImageStorage: image == undefined ? "https://firebasestorage.googleapis.com/v0/b/imagindragons-e576d.appspot.com/o/images%2FimagePlaylistDemo.jpg?alt=media&token=be33d621-be06-488a-9636-d65b4bdcabca.jpeg" : image
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      }
    })
  }

  removePlaylist(id: string) {
    this.fs.collection("playlist").doc(id).delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  unfollowPlaylistRO(id: string) {
    this.authService.getCurrentUser().then(user =>{
      this.fs.collection("playlist").doc(id).update({
        canRead:firebase.firestore.FieldValue.arrayRemove(user.email)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    })
  }

  unfollowPlaylistRaW(id: string) {
    this.authService.getCurrentUser().then(user => {
      this.fs.collection("playlist").doc(id).update({
        canWrite:firebase.firestore.FieldValue.arrayRemove(user.email)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    })
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

  unSharePlaylistReadOnly(id:string,email:string){
    // Create a reference to the SF doc.
    var canReadDocRef = this.fs.collection("playlist").doc(id);
    // Atomically add a new region to the "regions" array field.
    canReadDocRef.update({canRead: firebase.firestore.FieldValue.arrayRemove(email)});
  }

  unSharePlaylistReadAndWrite(id:string,email:string){
    // Create a reference to the SF doc.
    var canReadDocRef = this.fs.collection("playlist").doc(id);
    // Atomically add a new region to the "regions" array field.
    canReadDocRef.update({canWrite: firebase.firestore.FieldValue.arrayRemove(email)});
  }

  addMusic(playlistId: string, music: Musique) {
    this.authService.getCurrentUser().then(user =>{
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
    })
  }

  removeMusique(playlistId: string, music: Musique) {
    this.fs.collection("playlist").doc(playlistId).collection('musiques').doc(music.id).delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
}
