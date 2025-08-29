import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
