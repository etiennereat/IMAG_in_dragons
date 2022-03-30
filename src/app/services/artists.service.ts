import { Artists } from './../models/artists';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Musique } from '../models/Musique';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  constructor(private fs: AngularFirestore) { }

  getAllArtists() : Observable<Artists[]>{
    return this.fs.collection<Artists>('artist').valueChanges({idField:'id'});
  }

  getAllMusicsFromArtist(id: string) : Observable<Musique[]>{
    return this.fs.collection<Musique>(`musique`,ref => ref.where('idAuteur','==',id)).valueChanges({idField:'id'});
  }
}
