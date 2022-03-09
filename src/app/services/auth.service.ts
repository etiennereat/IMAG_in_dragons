import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  register(email:string, password:string){
    this.auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      this.sendVerificationEmail();
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("["+errorCode+"]"+" "+errorMessage);
      });
  }

  private sendVerificationEmail(){
    firebase.auth().currentUser.sendEmailVerification()
  .then(() => {
    this.router.navigate(['/login'])
  });
  }

  private failConnect(errorMessage){
      //todo pop up error
  }

  connectWithUserAuthentification(email:string, password:string){
    this.auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
  
        // Signed in 
        const user = userCredential.user;
        this.router.navigate(['/home'])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("["+errorCode+"]"+" "+errorMessage);
      });
  }

    connectwithgoogle(){
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          this.router.navigate(['/home'])
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
    }
  
    connectwithtwitter(){
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          this.router.navigate(['/home'])
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
    }
  
    connectwithgithub(){
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          this.router.navigate(['/home'])
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
        });
    }

    getCurrentUser(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          return user;
        } else {
          // User is signed out
        }
      });
    }
}
