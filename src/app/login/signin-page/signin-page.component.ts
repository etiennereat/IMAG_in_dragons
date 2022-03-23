import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss'],
})
export class SigninPageComponent implements OnInit {

  signinForm: FormGroup

  constructor(private fb: FormBuilder,
    public auth: AngularFireAuth, 
    private router: Router,
    private toastController:ToastController
    ) {
      this.signinForm = this.fb.group(
        { 
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

  ngOnInit() {}
  
  connectWithUserAuthentification(){
  
  const email = this.signinForm.get('email').value;
  const password = this.signinForm.get('password').value;
  this.auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.succesConnect();
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
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.succesConnect();
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
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.succesConnect();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to connect")
      });
  }

  connectwithgithub(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.succesConnect();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.error("["+errorCode+"]"+" "+errorMessage);
        this.presentErrorToast("Error trying to connect")
      });
  }

  private succesConnect(){
    this.router.navigate([""]);
  }

  forgotPassword(){
    const email = this.signinForm.get('email').value;
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

