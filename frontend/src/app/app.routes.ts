import { Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailedComponent } from './recipe-detailed/recipe-detailed.component';
import { ProfileComponent } from './profile/profile.component';
import { AddRecipePanelComponent } from './add-recipe-panel/add-recipe-panel.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';

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
  {
    path: 'add-recipe',
    component: AddRecipePanelComponent,
    data: { title: 'Cibaria | Add Recipe' },
  },
  {
    path: 'update-recipe/:id',
    component: EditRecipeComponent,
    data: { title: 'Cibaria | Update Recipe' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Cibaria | Your profile' },
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
