import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FooterSectionComponent } from '../footer-section/footer-section.component';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FooterSectionComponent,
    NavbarComponent,
    TranslateModule,
    MobileNavComponent,
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  onLogin(): void {
    this.authService.login(this.formEmail, this.formPassword).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
        console.log(response.token);
      },
      error: (err) => {
        console.error(err);
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
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
          console.log(response.token);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  isEqual = true;
  comparePasswords(): void {
    this.isEqual = this.formPassword === this.formRetypePassword;
  }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.isMobile = window.innerWidth <= 800;
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

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = window.innerWidth <= 800 ? true : false;
  }
}
