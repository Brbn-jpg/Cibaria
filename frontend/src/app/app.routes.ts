import { Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
