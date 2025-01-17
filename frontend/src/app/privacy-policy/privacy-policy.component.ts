import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, FooterSectionComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent implements AfterViewInit {
  ngAfterViewInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
