import { ToastController } from '@ionic/angular';
import { emailVerified } from '@angular/fire/auth-guard';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup

  constructor(private fb: FormBuilder,
    public auth: AngularFireAuth,
    private router: Router,
    private toastController:ToastController) {
    this.registerForm = this.fb.group(
      { 
        pseudo: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]]
      });
  }

  ngOnInit() {}

  register(){
  const email = this.registerForm.get('email').value;
  const password = this.registerForm.get('password').value;
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
