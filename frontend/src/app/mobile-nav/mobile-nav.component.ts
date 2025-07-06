import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../language.service';
import { ScrollLockService } from '../scroll-lock.service';
import { filter } from 'rxjs';

const mainUrl = 'http://localhost:4200/';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
})
export class MobileNavComponent {
  params = {
    home: mainUrl + '/',
    about: mainUrl + '/about-us',
    contact: mainUrl + '/contact',
    login: mainUrl + '/login',
  };

  isLoggedIn = false;
  Open = false;

  OnInit(): void {
    this.getToken();
  }

  getToken(): void {
    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }

  language: string = 'en';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private el: ElementRef,
    private scrollLockService: ScrollLockService,
    private router: Router
  ) {
    this.languageService.language$.subscribe((language) => {
      this.language = language;
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.scrollLockService.unlockScroll();
        });
    });
    this.translate.setDefaultLang(this.language);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const mobileBreakpoint = 800;
    if (window.innerWidth > mobileBreakpoint && this.Open) {
      this.closeMenu();
    }
  }

  changeLanguage(): void {
    const newLanguage = this.language === 'en' ? 'pl' : 'en';
    this.languageService.setLanguage(newLanguage);
    this.translate.use(newLanguage);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  getFlagImage(): string {
    return this.language === 'en'
      ? 'images/flags/pl.svg'
      : 'images/flags/us.svg';
  }

  getAltText(): string {
    return this.language === 'en'
      ? 'Zmien język na polski'
      : 'Change language to English';
  }

  openMenu(): void {
    const menu = this.el.nativeElement.querySelector('.nav-menu');
    if (menu) {
      menu.classList.add('active');
      this.Open = true;
      this.scrollLockService.lockScroll();
    }
  }

  closeMenu(): void {
    const menu = this.el.nativeElement.querySelector('.nav-menu');
    if (menu) {
      menu.classList.remove('active');
      this.Open = false;
      this.scrollLockService.unlockScroll();
    }
  }
}
