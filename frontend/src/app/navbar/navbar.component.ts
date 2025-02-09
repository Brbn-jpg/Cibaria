import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const mainUrl = 'http://localhost:4200/';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  params = {
    home: mainUrl + '/',
    about: mainUrl + '/about-us',
    contact: mainUrl + '/contact',
    login: mainUrl + '/login',
  };

  ngOnInit(): void {
    this.getToken();
  }

  isLoggedIn = false;

  getToken(): void {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }

  currentLanguage: string = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLanguage);
  }

  changeLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'pl' : 'en';
    this.translate.use(this.currentLanguage);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  getFlagImage(): string {
    return this.currentLanguage === 'en'
      ? 'images/flags/pl.svg'
      : 'images/flags/us.svg';
  }

  getAltText(): string {
    return this.currentLanguage === 'en'
      ? 'Zmien język na polski'
      : 'Change language to English';
  }
}
