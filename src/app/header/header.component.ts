import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn = false;
  loggedInAsGuest = false;
  username: any = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginService.islogged$.subscribe(isLogged => {
      if (isLogged) {
        this.loggedIn = isLogged;
      }
    });
    this.loginService.isloggedAsGuest$.subscribe(isLoggedAsGuest => {
      if (isLoggedAsGuest) {
        this.loggedInAsGuest = isLoggedAsGuest;
      }
    });

    this.loginService.username$.subscribe(name => {
      this.username = name;
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }

}
