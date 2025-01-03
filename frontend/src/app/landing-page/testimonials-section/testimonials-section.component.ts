import { Component, OnInit } from '@angular/core';
import { testimonials } from '../../../assets/js/testimonials.js';

declare function Testimonials(): void;

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css'],
})
export class TestimonialsSectionComponent implements OnInit {
  ngOnInit(): void {
    testimonials();
  }
}
