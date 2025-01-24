import { Component } from '@angular/core';
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
export class NavbarComponent {
  params = {
    home: mainUrl + '/',
    about: mainUrl + '/about-us',
    contact: mainUrl + '/contact',
    login: mainUrl + '/login',
  };

  isLoggedIn = false;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  // switch(param: string) {
  //   switch (param) {
  //     case 'home':
  //       break;
  //     case 'about':
  //       break;
  //     case 'contact':
  //       break;
  //     case 'login':
  //       break;
  //     default:
  //       return mainUrl;
  //   }
  // }
}
