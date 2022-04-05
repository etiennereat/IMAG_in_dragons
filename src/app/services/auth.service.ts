import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { MusiqueService } from './musique.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
    private router:Router,
    private toastController:ToastController,
    private alertController:AlertController,
    private musiqueServ: MusiqueService) { }

  getCurrentUser(){
    return this.auth.currentUser;
  }  

  connectWithUserAuthentification(email:string,password:string){
    this.auth.signInWithEmailAndPassword(email, password)
    .then(_ => {
        // Signed in 
        this.router.navigate([""]);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //console.error("["+errorCode+"]"+" "+errorMessage);
      this.presentErrorToast("Incorrect email or passsword")
    });
  }

  connectwithgoogle(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(_ => {
        // Signed in
        this.router.navigate([""]);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to connect")
      });
  }

  connectwithtwitter(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(_ => {
        // Signed in
        this.router.navigate([""]);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to connect")
      });
  }

  connectwithgithub(){
    this.auth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(_ => {
        // Signed in
        this.router.navigate([""]);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to connect")
      });
  }

  forgotPassword(email:string){
    this.auth.sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent!
        this.presentToast("Send an email to reset password")
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to send the reset password email")
      });
  }

  register(email:string, password:string){
    this.auth.createUserWithEmailAndPassword(email, password)
        .then(_ => {
        // User created
        this.SendVerificationMail()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying creating the account")
      });
  }

  SendVerificationMail(){
    return this.auth.currentUser.then(user => {
      user.sendEmailVerification().then(_ =>{
        this.presentToast("Verification mail sent");
        this.router.navigate(['/login'])
      })
    })
  }  

  disconnect(){
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Log out?',
      message: "Are you sure you want to log out ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: () => {
            this.musiqueServ.purgeService();
            try{
              this.auth.signOut()
              this.router.navigate(['/login-or-register'])
            }
            catch(error){
              this.presentErrorToast("Error trying to sign out")
            };
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"checkmark-outline"
    });
    toast.present();
  }

  async presentErrorToast(text:string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      icon:"close-outline"
    });
    toast.present();
  }
}
