import { Artists } from './../models/artists';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Musique } from '../models/Musique';
import { first } from 'rxjs/operators';

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

  getOneArtist(id: string) : Observable<Artists>{
    try{
      return this.fs.doc<Artists>('artist/'+id).valueChanges({idField:'id'});
    }
    catch(e){
      return null;
    }
  } 

  public tryToAddArtistToFirestore(nom : string){
    var artist$ = this.getOneArtist(nom)
    if(artist$ == null){
      this.addArtistToFirestore(new Artists(nom,nom,0))
    }
    else{ 
      artist$.pipe(first()).subscribe(artist => {   
        this.addArtistToFirestore(artist)
      })
    }
  }

  private addArtistToFirestore(artist :Artists){  
    this.fs.collection("artist").doc(artist.id).set({
      nom : artist.nom,
      NbMusique : (artist.NbMusique + 1)
    }).catch((error)=>{
      console.error(error)
    })
  }
}
