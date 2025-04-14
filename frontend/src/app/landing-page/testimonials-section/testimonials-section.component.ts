import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

declare function Testimonials(): void;

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css'],
})
export class TestimonialsSectionComponent implements OnInit {
  ngOnInit(): void {
    const track = document.querySelector('.gallery') as HTMLElement;
    const handleOnDown = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        track.dataset['mouseDownAt'] = e.clientX.toString();
      } else {
        track.dataset['mouseDownAt'] = e.touches[0].clientX.toString();
      }
    };
    const handleOnUp = () => {
      track.dataset['mouseDownAt'] = '0';
      track.dataset['prevPercentage'] = track.dataset['percentage'];
    };
    const handleOnMove = (e: MouseEvent | TouchEvent) => {
      if (track.dataset['mouseDownAt'] === '0') return;
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const mouseDownAt = track.dataset['mouseDownAt']
        ? parseFloat(track.dataset['mouseDownAt'])
        : 0;
      const mouseDelta = mouseDownAt - clientX;
      const maxDelta = window.innerWidth / 2;
      const percentage = (mouseDelta / maxDelta) * -100;
      const prevPercentage = track.dataset['prevPercentage']
        ? parseFloat(track.dataset['prevPercentage'])
        : 0;
      const nextPercentageUnconstrained = prevPercentage + percentage;
      const maxScrollPercentage =
        (-(track.scrollWidth - track.clientWidth) / track.clientWidth) * 100;
      const nextPercentage = Math.max(
        Math.min(nextPercentageUnconstrained, 0),
        maxScrollPercentage
      );
      track.dataset['percentage'] = nextPercentage.toString();
      track.animate(
        {
          transform: `translate(${nextPercentage}%, 0%)`,
        },
        { duration: 1200, fill: 'forwards' }
      );
      for (const image of Array.from(
        track.querySelectorAll('.testimonial-gallery-img')
      )) {
        image.animate(
          {
            objectPosition: `${100 + nextPercentage / 2}% center`,
          },
          { duration: 1200, fill: 'forwards' }
        );
      }
    };
    window.onmousedown = (e) => handleOnDown(e);
    window.ontouchstart = (e) => handleOnDown(e);
    window.onmouseup = () => handleOnUp();
    window.ontouchend = () => handleOnUp();
    window.onmousemove = (e) => handleOnMove(e);
    window.ontouchmove = (e) => handleOnMove(e);
  }
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
