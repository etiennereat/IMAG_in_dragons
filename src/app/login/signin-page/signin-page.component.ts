import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss'],
})
export class SigninPageComponent implements OnInit {

  signinForm: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService) {
      this.signinForm = this.fb.group(
        { 
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

  ngOnInit() {}
  
  connectWithUserAuthentification(){
    var email = this.signinForm.get('email').value;
    var password = this.signinForm.get('password').value;
    this.authService.connectWithUserAuthentification(email, password);
    }

  connectwithgoogle(){
    this.authService.connectwithgoogle();
  }

  connectwithtwitter(){
    this.authService.connectwithtwitter();
  }

  connectwithgithub(){
    this.authService.connectwithgithub();
  }
}

