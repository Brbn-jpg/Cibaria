import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showRegister() {
    document.querySelector('.login')?.classList.add('hidden');
    document.querySelector('.already-login')?.classList.add('hidden');
    document.querySelector('.already-login')?.classList.add('hidden');
    document.querySelector('.register')?.classList.remove('hidden');
    document.querySelector('.already-register')?.classList.remove('hidden');
  }

  showLogin() {
    document.querySelector('.register')?.classList.add('hidden');
    document.querySelector('.already-register')?.classList.add('hidden');
    document.querySelector('.login')?.classList.remove('hidden');
    document.querySelector('.already-login')?.classList.remove('hidden');
  }
}
