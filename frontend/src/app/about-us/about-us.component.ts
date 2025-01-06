import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterLink, FooterSectionComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements AfterViewInit {
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
}
