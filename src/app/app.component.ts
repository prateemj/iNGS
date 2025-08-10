import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  username: any = '';
  currentRoute = '';

  constructor(private loginService: LoginService, private router : Router) {
  }

  ngOnInit() {
    this.initMSAL();
  }

  async initMSAL() {
    this.loginService.initMSAL();
  }

  showBgImg() {
    return this.router.url == '/login';
  }

}