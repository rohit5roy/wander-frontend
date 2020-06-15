import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {GlobalConstants} from '../utils/global-constants';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../utils/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  get data() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    } else {
      const body = {
        Name: this.registerForm.get('firstname').value,
        LastName: this.registerForm.get('lastname').value,
        DocumentNumber: 11111123,
        UserName: this.registerForm.get('username').value,
        Password: this.registerForm.get('password').value,
        Email: this.registerForm.get('email').value
      };

      interface TokenResponse{
        token: string;
      }
      this.http.post<TokenResponse>(GlobalConstants.apiURL + GlobalConstants.registrationPath , body).subscribe(
        (response) => {
          console.log('registration response:::::: ' + response.token);
          this.authService.setSession(response.token);
          this.router.navigateByUrl('/home');
        },
        (error) => {
          console.log(error);
          if (error.error.message.includes('JWT expired')){
            this.authService.logout();
          }
        }
      );
      this.router.navigate(['/register']);
    }
  }
}
