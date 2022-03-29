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
  
  storageMusiqueRef : firebase.storage.Reference;
  storageImageRef : firebase.storage.Reference;
  private currentMusique : MediaObject;
  public indiceCurrentMusiquePlay: number;
  
  private playIcon = new Subject<string>();
  private actualStateOfPlayIcon : string;

  private musiqueInfosubscribable = new Subject<Musique>();
  private actualMusiqueInfosubscribable : Musique;

  private musicTimeDuration = new Subject<number>();
  private musicProgress = new Subject<number>();
  private musicCurrrentTime = new Subject<number>();
  private currentMusiqueQueue: Musique[];
  private state : number; //0 play classique / 1 repet queue / 2 repet track
  private progress:number;

  constructor(private afs: AngularFirestore, private media: Media) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('images');
    this.currentMusiqueQueue = new Array<Musique>();
    this.state = 1;
    this.actualMusiqueInfosubscribable = new Musique("Loading","Loading","Loading","Loading")
    this.updatePlayIcon("play")
    setInterval(() => {
      if(!this.isNull()){
        this.getPosition().then((position) => {
          var audioDuration = Math.floor(this.getDuration());
          this.musicTimeDuration.next(audioDuration)
          var currentPosition = Math.floor(position);
          this.musicCurrrentTime.next(currentPosition)
          this.progress = (currentPosition / audioDuration) * 100
          this.musicProgress.next(this.progress)
          if(this.progress == 100){
            this.playNextMusique();
          }
        });
      }
    }, 1000 );
  }

  //Reset queue by the only musique 
  public playMusique(musique: Musique){    
    //if same musique do nothing exept resume musique     
      if(this.indiceCurrentMusiquePlay != null && this.currentMusiqueQueue[this.indiceCurrentMusiquePlay].id == musique.id){
        //resume current musique
        this.resumeMusique();
        this.updateMusiqueInfosubscribable(musique)
      }
      //else reset queue by this only one music
      else{
        if(this.currentMusique !=null){
          this.stopMusique();
        }
        this.indiceCurrentMusiquePlay = 0;
        this.currentMusiqueQueue = new Array<Musique>();
        this.currentMusiqueQueue.push(musique)
        this.startMusique(musique);
      }      
    }

    //joue la musique suivante en fonction du state 
    public playNextMusique(){
      switch(this.state){
        case 0 :
          if(this.indiceCurrentMusiquePlay + 1 == this.currentMusiqueQueue.length){
            //do nothing end of the queue
            this.stopMusique();
          }
          else{
            this.stopMusique();
            this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay + 1;
            this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          }
          break;
        case 1 :
            this.stopMusique();
            this.indiceCurrentMusiquePlay = (this.indiceCurrentMusiquePlay + 1) % this.currentMusiqueQueue.length;
            this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
            break;
        case 2 :
            this.restartCurrentMusique();
            break;
        }
    }

    //joue la musique precedente en fonction du state 
    public playPreviousMusique(){
      switch(this.state){
        case 0 :
            if(this.indiceCurrentMusiquePlay != 0){
              this.stopMusique();
              this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay - 1;
              this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
            }
            else{
              this.restartCurrentMusique();
            }
          break;
        case 1 :
        case 2 :
          if(this.indiceCurrentMusiquePlay == 0){
            this.indiceCurrentMusiquePlay = this.currentMusiqueQueue.length - 1;
          } 
          else{
            this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay - 1;
          }
          this.stopMusique();
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          break;
        }
    }

    //ajoute a la queue la musique en parametre la demare si la liste etait vide ou términé 
    public addToQueue(musique:Musique){
      this.currentMusiqueQueue.push(musique);
      if(this.currentMusique == null && this.getActualStateOfPlayIcon() != "cloud-download-outline"){
        if(this.currentMusiqueQueue.length == 1){
          this.playMusique(musique);
        }
        else{
          this.indiceCurrentMusiquePlay = this.indiceCurrentMusiquePlay + 1;
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
        }
      }
    }

    //ajoute une liste a la queue de lecture 
    public addPlaylistToQueue(musiqueList:Musique[]){
      for (var index = 0; index < musiqueList.length; index++) {
        this.addToQueue(musiqueList[index]);
      }
    }

    //joue et ajoute les musique de la liste a la queue de lecture 
    public playPlaylist(musiqueList:Musique[]){
      if(musiqueList.length > 0){
        this.playMusique(musiqueList[0]);
        this.addPlaylistToQueue(musiqueList.slice(1))
      }
    }

    //recupère l'URL de telechargement et lance la musique 
    private launchMusique(musique : Musique){
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
      // Get the download URL
      starsRef.getDownloadURL()
      .then((url) => {
        musique.urlMusique = url;
        this.currentMusique = this.media.create(url);
        this.currentMusique.play();
        this.updatePlayIcon("pause")
        this.updateMusiqueInfosubscribable(musique)

      })
      .catch((error) => {
        console.error(error.code)
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
          case 'storage/quota-exceeded':
            alert("Le quota d'utilisation est depassé !")
            break;
        }
        if(this.state != 2 && error.code != 'storage/quota-exceeded'){
          this.playNextMusique();
        }
      })
    }

    // Joue une musique en fonction de son etat

    private startMusique(musique:Musique){
      //si on a deja download l'url on le recup direct 
      if(musique.urlMusique != null){
        this.currentMusique = this.media.create(musique.urlMusique);
        this.currentMusique.play();
        this.updatePlayIcon("pause")
        this.updateMusiqueInfosubscribable(musique)

      }
      else{
        //si les info de la musique sont seulement light
        this.updatePlayIcon("cloud-download-outline");
        if(musique.idMusiqueStorage == null){
          this.getMusique(musique.id).subscribe(res => {
            this.currentMusiqueQueue[this.indiceCurrentMusiquePlay] = res;
            this.launchMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          })
        }
        else{
          this.launchMusique(musique)
        }
      }
    }

    private updatePlayIcon(state : string){
      this.playIcon.next(state);
      this.actualStateOfPlayIcon = state;
    }

    private updateMusiqueInfosubscribable(musique : Musique){
      this.musiqueInfosubscribable.next(musique)
      this.actualMusiqueInfosubscribable = musique;
    }
    
    addMusiqueToFirestore(musique :Musique){  
      console.log(musique)
      this.afs.collection("musique").doc().set({
        idUserContributor : firebase.auth().currentUser.email,
        dateAjout : firebase.firestore.Timestamp.fromDate(new Date()),
        idAuteur : musique.idAuteur,
        idImageStorage : musique.idImageStorage,
        idMusiqueStorage : musique.idMusiqueStorage,
        nom : musique.nom,
        nomAlbum : musique.nomAlbum
      }).catch((error)=>{
        console.error(error)
      })
    }
    
/*-------------------------------------------------Methode-manipulation-Media-Musique-------------------------------------------------------*/
    public restartCurrentMusique(){
      this.currentMusique.pause()
      this.currentMusique.getCurrentPosition().then(res=>{
        this.currentMusique.seekTo(res);
        this.currentMusique.play();
      });
    }

    public pauseMusique(){
      this.currentMusique.pause();
      this.updatePlayIcon("play")
    }
    
    public stopMusique(){
      this.currentMusique.stop();
      this.currentMusique.release();
      this.updatePlayIcon("play")
      this.currentMusique = null;
    }

    public resumeMusique(){
      this.currentMusique.play();
      this.updatePlayIcon("pause")
    }

/*------------------------------------------------------------Getter-Setter------------------------------------------------------------------*/

    isNull(){
      return this.currentMusique == null;
    }
  
    getDuration(){
      return Math.floor(this.currentMusique.getDuration());
    }
  
    getPosition(){
      return this.currentMusique.getCurrentPosition()
    }
  
    getCurrentmusicTimeDuration():Subject<number>{
    return this.musicTimeDuration
    }

    getCurrentmusicCurrentTime():Subject<number>{
      return this.musicCurrrentTime
    }

    getCurrentmsucProgress():Subject<number>{
      return this.musicProgress
    }
  
    seekTo(time:number){
      this.currentMusique.seekTo(time);
    }
      
    getMusique(idMusique: string) :Observable<Musique>{
      return this.afs.doc<Musique>('musique/'+idMusique).valueChanges({idField:'id'});
    }

    getAllMusique():Observable<Musique[]>{ 
      return this.afs.collection<Musique>('musique').valueChanges({idField:'id'});
    }
    
    getCurrentplayicon():Subject<string>{
      return this.playIcon
    }  

    getActualStateOfPlayIcon(): string{
      return this.actualStateOfPlayIcon;
    }


    getMusiqueUrl(musique: Musique){
        var starsRef = this.storageImageRef.child(musique.idImageStorage);
        starsRef.getDownloadURL().then(res => {
            musique.urlImage = res;
        });
    }

    getCurrentPlayMusique(): Subject<Musique>{
      return this.musiqueInfosubscribable;
    }

    getActualMusiqueInfosubscribable() : Musique {
        return this.actualMusiqueInfosubscribable;
    }
}
