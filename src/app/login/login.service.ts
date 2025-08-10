import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { loginRequest } from '../auth.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private msalService = inject(MsalService);
  private pca = this.msalService.instance;

  private islogged = new BehaviorSubject<boolean | null>(null);
  isloggedAsGuest = new BehaviorSubject<boolean | null>(null);
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  islogged$ = this.islogged.asObservable();
  isloggedAsGuest$ = this.isloggedAsGuest.asObservable();
  username$ = this.usernameSubject.asObservable();


  constructor() { }

  async initMSAL() {
    await this.pca.initialize();
    this.checkAccount();
  }

  async login() {
    await this.pca.initialize(); // Ensure MSAL is initialized before login
    const result: any = await this.msalService.loginPopup(loginRequest).toPromise();
    this.pca.setActiveAccount(result.account);
    await this.checkAccount();
  }

  logout() {
    this.pca.logoutPopup();
    this.islogged.next(false);
      this.usernameSubject.next('');
    localStorage.setItem("loggedIn", "false");
    localStorage.setItem("username", "");
  }

  checkAccount() {
    const account = this.pca.getActiveAccount();
    if (account) {
      this.islogged.next(true);
      this.usernameSubject.next(account.name ?? '');
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', account.name ?? '');
    } else {
      this.islogged.next(false);
      this.usernameSubject.next('');
      localStorage.setItem('loggedIn', 'false');
      localStorage.setItem('username', '');
    }
  }
}
