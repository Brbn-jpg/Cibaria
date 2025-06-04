import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { SliderComponent } from './slider/slider.component';
import { FeatureSectionComponent } from './feature-section/feature-section.component';
import { TestimonialsSectionComponent } from './testimonials-section/testimonials-section.component';
import { CtaSectionComponent } from './cta-section/cta-section.component';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    SliderComponent,
    FeatureSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent,
    FooterSectionComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.isMobile = window.innerWidth <= 800;
  }

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800;
  }
}
