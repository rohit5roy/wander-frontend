import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../utils/global-constants';
import {AuthService} from '../utils/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get data() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      const body = {
        UserName: this.loginForm.get('username').value,
        Password: this.loginForm.get('password').value
      };

      interface TokenResponse{
        token: string;
      }
      this.http.post<TokenResponse>(GlobalConstants.apiURL + GlobalConstants.loginPath , body).subscribe(
        (response) => {
          console.log('response:::::: ' + response.token);
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
    }
  }
}
