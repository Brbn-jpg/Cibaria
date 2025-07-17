import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [
    FooterSectionComponent,
    RouterModule,
    NavbarComponent,
    TranslateModule,
    MobileNavComponent,
  ],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css',
})
export class TermsOfServiceComponent implements OnInit {
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
