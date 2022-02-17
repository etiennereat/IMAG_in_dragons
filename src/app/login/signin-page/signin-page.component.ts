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
    private router: Router
    ) {
      this.signinForm = this.fb.group(
        { 
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

  ngOnInit() {}

  connectwithgoogle(){
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.router.navigate(['/playlist'])
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
        this.router.navigate(['/playlist'])
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
        this.router.navigate(['/playlist'])
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });
  }

  connect(){
    //try to connect
    console.log(this.signinForm.get('email').value)
    console.log(this.signinForm.get('password').value)
  }

}
