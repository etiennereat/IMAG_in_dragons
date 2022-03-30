import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import {  Observable } from 'rxjs';
import { MusiqueService } from 'src/app/services/musique.service';
import {  AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import * as mm from 'music-metadata/lib/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Musique } from 'src/app/models/Musique';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-add-musique',
  templateUrl: './add-musique.component.html',
  styleUrls: ['./add-musique.component.scss'],
})
export class AddMusiqueComponent implements OnInit {

  constructor(private musiqueService:MusiqueService,
    private angularFireStorage: AngularFireStorage,
    private toastController: ToastController,
    private domSanitizer : DomSanitizer,
    private modaleCtrl : ModalController,
    private musiqueServ : MusiqueService
    ) { 
      this.isImgUploading = false;
      this.isImgUploaded = true;
      this.cover = null;

    }
 


    ngFireUploadTask: AngularFireUploadTask;

    progressNum: Observable<number>;
  
    progressSnapshot: Observable<any>;
  
    fileUploadedPath: Observable<string>;
  
    files: Observable<FILE[]>;
  
    FileName: string;
    FileSize: number;
  
    isImgUploading: boolean;
    isImgUploaded: boolean;

    cover: SafeUrl;
  

  ngOnInit() {}



  fileUpload(event: FileList) {
    const file = event.item(0)
    if (file.type.split('/')[0] !== 'audio') { 
      console.log('File type is not supported!')
      return;
    }

    var title = "Unknown";
    var artiste ="Unknown";
    var musiquePathStorage;
    var dateAjout = new Date();
    var album = "Unknown";
    var imagePathStorage = "imageDemo.jpeg"

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    musiquePathStorage = `musiques/${new Date().getTime()}_${file.name}`;

    const musicRef = this.angularFireStorage.ref(musiquePathStorage);

    this.ngFireUploadTask = this.angularFireStorage.upload(musiquePathStorage, file);
    

    
    file.arrayBuffer().then(async res => {
      mm.parseBuffer(new Uint8Array(res)).then( common=>{
        if(common.common.album != undefined)
          album = common.common.album;
        if(common.common.artist != undefined)
          artiste = common.common.artist;
        if(common.common.title != undefined)
          title = common.common.title;
        const cover = mm.selectCover(common.common.picture);
        if(cover != null){
          let TYPED_ARRAY = new Uint8Array(cover.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');
          let base64String = btoa(STRING_CHAR);
          this.cover = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
          
          var metadata = {
            contentType : "image/jpeg"
          }
          imagePathStorage = `${new Date().getTime()}_${this.FileName.split('.')[0].concat(".jpeg")}`;
          const imageRef = this.angularFireStorage.ref("images/"+imagePathStorage);
          this.ngFireUploadTask = this.angularFireStorage.upload("images/"+imagePathStorage, cover.data, metadata);
        }
      })
    })

    this.progressNum =this.ngFireUploadTask.percentageChanges().pipe(   
      finalize(() => {
        this.fileUploadedPath = musicRef.getDownloadURL();
          
        this.fileUploadedPath.subscribe(()=>{
          this.isImgUploading = false;
          this.isImgUploaded = true;
          const storageImageRef = firebase.storage().ref('images');
          var starsRef = storageImageRef.child(imagePathStorage);
          starsRef.getDownloadURL().then(imageUrl => {
            var musique = new Musique("",artiste,imageUrl,title,dateAjout,musiquePathStorage.split('/')[1], album)
            this.musiqueServ.addMusiqueToFirestore(musique);
            this.notifySuccesUpload()
          })
        },error => {
          console.log(error);
        })
      })
    )
  }
  async notifySuccesUpload(){
    const toast = await this.toastController.create({
      message: `${this.FileName} upload succesfuly`,
      duration: 2000,
      icon:"checkmark-outline"
    });
    this.modaleCtrl.dismiss();
    toast.present();
  }
}
