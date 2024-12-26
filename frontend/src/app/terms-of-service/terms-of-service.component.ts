import { Component } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [FooterSectionComponent, RouterLink],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css',
})
export class TermsOfServiceComponent {}
