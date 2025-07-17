import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    FooterSectionComponent,
    NavbarComponent,
    TranslateModule,
    MobileNavComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent implements OnInit {
  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.isMobile = window.innerWidth <= 800;
  }
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
