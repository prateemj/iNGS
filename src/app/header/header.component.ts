import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn = false;
  username: any = '';

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.islogged$.subscribe(isLogged => {
      if (isLogged) {
        console.log('Subscribe in headercomp:', isLogged);
        this.loggedIn = isLogged;
        console.log("is logged in headercomp is", this.loggedIn)
        this.username = localStorage.getItem('username');
        console.log("is username in headercomp is", this.username)
    }
  });
}

}
