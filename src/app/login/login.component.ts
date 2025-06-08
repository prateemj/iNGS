import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LoginService } from './login.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loggedIn = false
  constructor(private loginService: LoginService, @Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  ngOnInit() {
  }

  async login() {
    await this.loginService.login();
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = localStorage.getItem('loggedIn') == 'true' ? true : false;
     if(this.loggedIn){
      this.router.navigateByUrl('/home');
     }
    }
  }

}
