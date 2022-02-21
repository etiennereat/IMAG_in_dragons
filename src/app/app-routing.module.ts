import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import { SigninOrRegisterPageComponent } from './login/signin-or-register-page/signin-or-register-page.component';
import { SigninPageComponent } from './login/signin-page/signin-page.component';

const routes: Routes = [
  {
    path: 'playlist',
    loadChildren: () => import('./playlist/playlist.module').then(m => m.PlaylistPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login-or-register',
    component: SigninOrRegisterPageComponent, 
  },
  {
    path: 'login',
    component: SigninPageComponent, 
  },
  {
    path: 'registration',
    component: RegisterPageComponent, 
  },
  {
    path: '',
    redirectTo: 'login-or-register',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
