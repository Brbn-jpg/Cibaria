import { AfterViewInit, Component } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [FooterSectionComponent, RouterModule, NavbarComponent],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css',
})
export class TermsOfServiceComponent implements AfterViewInit {
  ngAfterViewInit() {
    window.scrollTo({ top: 0 });
  }
}
