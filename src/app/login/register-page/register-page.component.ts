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

  constructor(private fb: FormBuilder,public auth: AngularFireAuth,    private router: Router) {
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
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    
    this.succesConnect();
  })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("["+errorCode+"]"+" "+errorMessage);
    });
  }

  private succesConnect(){
    this.router.navigate([""]);
  }

  private failConnect(errorMessage){
      //todo pop up error
  }

}
