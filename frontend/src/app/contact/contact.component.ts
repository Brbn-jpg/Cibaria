import { AfterViewInit, Component } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterSectionComponent, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements AfterViewInit {
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
}
