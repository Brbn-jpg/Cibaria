import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.css',
})
export class CtaSectionComponent implements OnInit {
  ngOnInit(): void {
    const hiddenElements = document.querySelectorAll(
      '.hidden'
    ) as NodeListOf<HTMLElement>;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });
    hiddenElements.forEach((element: HTMLElement) => {
      observer.observe(element);
    });
  }
}
