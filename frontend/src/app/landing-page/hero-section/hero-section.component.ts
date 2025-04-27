import { Component, Host, HostListener } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MobileNavComponent } from '../../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NavbarComponent, TranslateModule, MobileNavComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  isMobile = false;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800 ? true : false;
  }
}
