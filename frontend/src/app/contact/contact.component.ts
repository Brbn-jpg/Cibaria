import { AfterViewInit, Component } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterSectionComponent, NavbarComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements AfterViewInit {
  ngAfterViewInit() {
    window.scrollTo({ top: 0 });
  }
}
