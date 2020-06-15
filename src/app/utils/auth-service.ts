import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from './global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string ) {
    return this.http.post<string>(GlobalConstants.apiURL + GlobalConstants.loginPath, {UerName: username, Password: password});
  }

  public setSession(authResult) {
    console.log('TOKEN::::::::::: ' + authResult);
    localStorage.setItem('id_token', authResult);
  }

  logout() {
    console.log('LOGOUT::::::::::: ');
    localStorage.removeItem('id_token');
  }

  public isLoggedIn() {
    return localStorage.getItem('id_token') !== null && localStorage.getItem('id_token') !== undefined;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

}
