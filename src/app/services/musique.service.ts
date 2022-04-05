import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Musique } from '../models/Musique';
import {  Observable, Subject } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Platform } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusiqueService {
  
  storageMusiqueRef : firebase.storage.Reference;
  storageImageRef : firebase.storage.Reference;
  private currentMusique : HTMLAudioElement;
  public indiceCurrentMusiquePlay: number;
  private NotifieIndiceCurrentMusiquePlay: Subject<number> = new Subject<number>();
  
  private playIcon = new Subject<string>();
  private actualStateOfPlayIcon : string;

  private currentMusiqueQueue = new Array<Musique>();
  private currentQueue = new Subject<Array<Musique>>();

  private musiqueInfosubscribable = new Subject<Musique>();
  private actualMusiqueInfosubscribable : Musique;

  private state : number; //0 play classique / 1 repet queue / 2 repet track
  private QueueMode = new Subject<number>();

  private musicTimeDuration = new Subject<number>();
  private musicProgress = new Subject<number>();
  private musicCurrrentTime = new Subject<number>();
  private progress:number;
  private intervalID :  NodeJS.Timeout;

  constructor(private afs: AngularFirestore, private platform: Platform) {
    this.storageMusiqueRef = firebase.storage().ref('musiques');
    this.storageImageRef = firebase.storage().ref('images');
    this.state = 1;
    this.actualMusiqueInfosubscribable = new Musique("Loading","Loading","https://firebasestorage.googleapis.com/v0/b/imagindragons-e576d.appspot.com/o/images%2FimagePlaylistDemo.jpg?alt=media&token=be33d621-be06-488a-9636-d65b4bdcabca","Loading")
    this.updateQueueMode()
    this.updatePlayIcon("play");
    this.intervalID = null;
  }

  private createPolling() : NodeJS.Timeout{
    return setInterval(() => {
      if(!this.isNull() && this.currentMusique != null){
          var audioDuration = Math.floor(this.getDuration());
          this.musicTimeDuration.next(audioDuration)
          var position = this.getPosition();
          var currentPosition = Math.floor(position);
          this.musicCurrrentTime.next(currentPosition)
          this.progress = currentPosition / audioDuration * 100
          this.musicProgress.next(this.progress)
          if(this.progress == 100 && audioDuration > 0){
            this.playNextMusique();
          }
      }
    }, 1000 );
  }


  public purgeService(){
    this.clearQueue();
    this.indiceCurrentMusiquePlay = null;
    this.actualMusiqueInfosubscribable = new Musique("Loading","Loading","https://firebasestorage.googleapis.com/v0/b/imagindragons-e576d.appspot.com/o/images%2FimagePlaylistDemo.jpg?alt=media&token=be33d621-be06-488a-9636-d65b4bdcabca","Loading")
    this.updatePlayIcon("play");
    if(this.currentMusique != null){
      this.stopMusique();
    }
    this.currentMusique = null;
    clearInterval(this.intervalID);
    this.intervalID = null;
    this.state = 1;
    this.updateQueueMode();
  }

  //Reset queue by the only musique 
  public playMusique(musique: Musique){    
    //if same musique do nothing exept resume musique     
      if(this.indiceCurrentMusiquePlay != null && this.currentMusiqueQueue[this.indiceCurrentMusiquePlay].id == musique.id){
        //resume current musique
        if(this.actualStateOfPlayIcon == "play"){
          this.resumeMusique();
        }
        this.updateMusiqueInfosubscribable(musique)
      }
      //else reset queue by this only one music
      else{
        if(this.currentMusique !=null){
          this.stopMusique();
        }
        this.updateindiceCurrentMusiquePlay(0);
        this.currentMusiqueQueue.splice(0)
        this.currentMusiqueQueue.push(musique)
        this.updateQueue()
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
            const indice = this.indiceCurrentMusiquePlay;;
            this.stopMusique();
            this.updateindiceCurrentMusiquePlay(indice + 1);
            this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          }
          break;
        case 1 :
            const indice = this.indiceCurrentMusiquePlay;;
            this.stopMusique();
            this.updateindiceCurrentMusiquePlay((indice + 1) % this.currentMusiqueQueue.length);
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
              const indice = this.indiceCurrentMusiquePlay;;
              this.stopMusique();
              this.updateindiceCurrentMusiquePlay(indice - 1);
              this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
            }
            else{
              this.restartCurrentMusique();
            }
          break;
        case 1 :
        case 2 :
          if(this.indiceCurrentMusiquePlay == 0){
            this.updateindiceCurrentMusiquePlay(this.currentMusiqueQueue.length - 1);
          } 
          else{
            const indice = this.indiceCurrentMusiquePlay;;
            this.stopMusique();
            this.updateindiceCurrentMusiquePlay(indice - 1);
          }
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
          break;
        }
    }

    //ajoute a la queue la musique en parametre la demare si la liste etait vide ou términé 
    public addToQueue(musique:Musique){
      this.currentMusiqueQueue.push(musique);
      this.updateQueue()
      if(this.currentMusique == null && this.getActualStateOfPlayIcon() != "cloud-download-outline"){
        if(this.currentMusiqueQueue.length == 1){
          this.playMusique(musique);
        }
        else{
          this.updateindiceCurrentMusiquePlay(this.indiceCurrentMusiquePlay + 1);
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
        }
      }
    }

    //ajoute une liste a la queue de lecture 
    public addPlaylistToQueue(musiqueList:Musique[]){
      for (var index = 0; index < musiqueList.length; index++) {
        this.currentMusiqueQueue.push(musiqueList[index]);
      }
      this.updateQueue();
    }

    //joue et ajoute les musique de la liste a la queue de lecture 
    public playPlaylist(musiqueList:Musique[], indiceMusiqueStart: number){
      if(musiqueList.length > 0){
        if(this.currentMusique !=null){
          this.stopMusique();
        }
        this.clearQueue()
        this.addPlaylistToQueue(musiqueList);
        this.playMusiqueInQueue(indiceMusiqueStart);
      }
    }

    public addMusiqueToFirestore(musique :Musique){  
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

    //recupère l'URL de telechargement et lance la musique 
    private launchMusique(musique : Musique){
      this.updatePlayIcon("cloud-download-outline");
      var starsRef = this.storageMusiqueRef.child(musique.idMusiqueStorage);
      // Get the download URL
        starsRef.getDownloadURL().then(url => {
          musique.urlMusique = url;
            this.currentMusique = new Audio(url);
            this.currentMusique.onpause = ()=>{
              clearInterval(this.intervalID);
              this.intervalID = null
            }
            this.currentMusique.onplay = ()=>{
              this.updatePlayIcon("pause")
              this.intervalID = this.createPolling();
            }
            this.currentMusique.play()

            this.updateMusiqueInfosubscribable(musique)
        })
      .catch(function(error) {
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
      });   
    }

    // Joue une musique en fonction de son etat
    private startMusique(musique:Musique){
      //si on a deja download l'url on le recup direct 
      if(musique.urlMusique != null){
        this.currentMusique = new Audio(musique.urlMusique);
        this.currentMusique.onpause = ()=>{
          clearInterval(this.intervalID);
          this.intervalID = null
        }
        this.currentMusique.onplay = ()=>{
          this.updatePlayIcon("pause")
          this.intervalID = this.createPolling();
        }
        this.currentMusique.play();
        this.updateMusiqueInfosubscribable(musique)

      }
      else{
        //si les info de la musique sont seulement light
        this.updatePlayIcon("cloud-download-outline");
        if(musique.idMusiqueStorage == null){
          var passage = 0
          this.getMusique(musique.id).subscribe(res => {
            if(passage == 0){
              this.currentMusiqueQueue[this.indiceCurrentMusiquePlay] = res;
              this.launchMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
              passage = 1
            }
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

    private updateQueue(){
      this.currentQueue.next(this.currentMusiqueQueue)
    }

    public removeFromQueue(index:number){
      this.currentMusiqueQueue.splice(index,1)
      if(this.currentMusiqueQueue.length != 0 && this.indiceCurrentMusiquePlay == index){
          this.stopMusique();
          this.playMusiqueInQueue(index % this.currentMusiqueQueue.length)
      }
      else{
        this.updateindiceCurrentMusiquePlay(this.indiceCurrentMusiquePlay - 1);
      }
      this.updateQueue()
    }

    public clearQueue(){
      if(this.currentMusique != null){
        this.stopMusique();
      }
      this.currentMusiqueQueue.splice(0)
      this.updateQueue()
    }

    public shuffleQueue(){
      this.currentMusiqueQueue = this.shuffle(this.currentMusiqueQueue)
      this.updateQueue()
    }

    public playMusiqueInQueue(indiceQueue: number){
      if(indiceQueue < this.currentMusiqueQueue.length && indiceQueue >= 0){
        if(indiceQueue == this.indiceCurrentMusiquePlay){
            this.resumeMusique();
        }
        else{
          if(this.currentMusique !=null){
            this.stopMusique();
          }
          this.updateindiceCurrentMusiquePlay(indiceQueue)
          this.startMusique(this.currentMusiqueQueue[this.indiceCurrentMusiquePlay])
        }
      }
    }

    private shuffle(list) {
      let currentIndex = list.length,randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
        if(currentIndex == this.indiceCurrentMusiquePlay){
          this.updateindiceCurrentMusiquePlay(randomIndex)
        }
        else if(randomIndex == this.indiceCurrentMusiquePlay){
          this.updateindiceCurrentMusiquePlay(currentIndex)
        }
      }
      return list;
    }

    private updateQueueMode(){
      this.QueueMode.next(this.state)
    }

    private updateindiceCurrentMusiquePlay(newIndice:number){
      this.indiceCurrentMusiquePlay = newIndice;
      this.NotifieIndiceCurrentMusiquePlay.next(this.indiceCurrentMusiquePlay);
    }
    
/*-------------------------------------------------Methode-manipulation-Musique-------------------------------------------------------*/
    public restartCurrentMusique(){
      this.seekTo(0)
      this.musicProgress.next(0)
      this.musicCurrrentTime.next(0)
    }

    public pauseMusique(){
      this.currentMusique.pause();
      this.updatePlayIcon("play")
    }
    
    public stopMusique(){
      this.currentMusique.pause();
      this.updatePlayIcon("play")
      this.currentMusique = null;
      this.updateindiceCurrentMusiquePlay(null);
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
      return Math.floor(this.currentMusique.duration);
    }
  
    getPosition(){
      return this.currentMusique.currentTime;
    }
  
    getCurrentmusicTimeDuration():Subject<number>{
    return this.musicTimeDuration
    }

    getCurrentmusicCurrentTime():Subject<number>{
      return this.musicCurrrentTime
    }

    getCurrentmusicProgress():Subject<number>{
      return this.musicProgress
    }
  
    seekTo(time:number){
      this.currentMusique.currentTime = time;
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

    getCurrentPlayMusique(): Subject<Musique>{
      return this.musiqueInfosubscribable;
    }

    getActualMusiqueInfosubscribable() : Musique {
        return this.actualMusiqueInfosubscribable;
    }

    getQueue(): Subject<Musique[]>{
      return this.currentQueue;
    }

    getQueueMusique(): Musique[]{
      return this.currentMusiqueQueue;
    }  

    getQueueMode(): Subject<number>{
      return this.QueueMode;
    }

    getIndiceCurrentMusiquePlaySubscribable(): Subject<number>{
      return this.NotifieIndiceCurrentMusiquePlay;
    }

    getIndiceCurrentMusiquePlay(): number{
      return this.indiceCurrentMusiquePlay;
    }
  
    setQueueMode(mode: number){
      this.state = mode
      this.updateQueueMode()
    }
}
