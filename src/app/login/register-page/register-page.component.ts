import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      { 
        pseudo: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]]
      });
  }

  ngOnInit() {}

  register(){
    // try to register
    console.log(this.registerForm.get('pseudo').value)
    console.log(this.registerForm.get('email').value)
    console.log(this.registerForm.get('password').value)
  }

}
