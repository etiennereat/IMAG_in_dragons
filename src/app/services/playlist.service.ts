import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { Playlist } from '../models/playlist';
import { Musique } from '../models/Musique';
import { flatMap, map, switchMap, tap } from 'rxjs/operators'
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

  addPlaylist(playlist: Playlist) {
    this.playlists = this.playlists.concat(playlist);
  }

  removePlaylist(playlist: Playlist) {
    this.playlists = this.playlists.filter(p => p.id !== playlist.id);
  }

  addMusic(playlistId: string, music: Musique) {
    /*const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    if (this.playlists[playlistIndex]) {
      this.playlists[playlistIndex].musics = this.playlists[playlistIndex].musics.concat(music);
    }*/
  }

  removeMusique(playlistId: string, music: Musique) {
    /*const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    if (this.playlists[playlistIndex]) {
      this.playlists[playlistIndex].musics = this.playlists[playlistIndex].musics.filter(t => t.id !== todo.id);
    }*/
  }
}
