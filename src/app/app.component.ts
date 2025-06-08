import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loggedIn = false;
  username: any = '';

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.islogged$.subscribe(isLogged => {
      if (isLogged) {
        console.log('Subscribe in appcomponent:', isLogged);
        this.loggedIn = isLogged;
        console.log("is logged in app comp is", this.loggedIn)
      }
    });
    this.initMSAL();
  }

  async initMSAL() {
    this.loginService.initMSAL();
  }

}