import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { Router } from '@angular/router';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FooterSectionComponent,
    TranslateModule,
    FormsModule,
    ToastNotificationComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('showSection', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  formUsername = '';
  formRetypePassword = '';
  formPassword = '';
  formEmail = '';
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {
    this.translate.setDefaultLang('en');
  }

  onLogin(): void {
    this.authService.login(this.formEmail, this.formPassword).subscribe({
      next: (response) => {
        if (this.rememberMe) {
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('token', response.token);
        }
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.notificationService.error('Username or password is incorrect');
      },
    });
  }

  onRegister(): void {
    if (this.formPassword !== this.formRetypePassword) {
      return;
    }
    this.authService
      .register(this.formUsername, this.formEmail, this.formPassword)
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/profile']);
          console.log(response.token);
        },
        error: (err) => {
          this.notificationService.error(
            'Registration failed. Please try again.'
          );
        },
      });
  }

  isEqual = true;
  comparePasswords(): void {
    this.isEqual = this.formPassword === this.formRetypePassword;
  }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  login = true;
  changeForm(): void {
    this.login = !this.login;
  }

  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  retypePassword = new FormControl('', [Validators.required]);

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
