import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import { SigninOrRegisterPageComponent } from './login/signin-or-register-page/signin-or-register-page.component';
import { SigninPageComponent } from './login/signin-page/signin-page.component';
import { AngularFireAuthGuard,emailVerified } from '@angular/fire/compat/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
const redirectUnverifiedTo = (redirect: any[]) => pipe(emailVerified, map(emailVerified => emailVerified || redirect));
const redirectUnauthorizedToLogin = () => redirectUnverifiedTo(['/login-or-register']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[AngularFireAuthGuard],
    data:{ authGuardPipe : redirectUnauthorizedToLogin}
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
