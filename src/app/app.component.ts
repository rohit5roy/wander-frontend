import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'COVID frontend';
  isHome: boolean;
  constructor(private route: Router){
  }

  ngOnInit() {
    console.log( window.location.href);
    this.isHome = (window.location.href).includes('/home');
  }
}
