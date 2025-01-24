import { Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailedComponent } from './recipe-detailed/recipe-detailed.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: { title: 'Cibaria | From Plans To Plates' },
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    data: { title: 'Cibaria | Terms Of Service' },
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: { title: 'Cibaria | About Us' },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: { title: 'Cibaria | Privacy Policy' },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Cibaria | Contact' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Cibaria | Login to explore the world of Cibaria' },
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    data: { title: 'Cibaria | Recipes' },
  },
  { path: 'recipes/:id', component: RecipeDetailedComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
