import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SigninOrRegisterPageComponent } from './login/signin-or-register-page/signin-or-register-page.component';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import { SigninPageComponent } from './login/signin-page/signin-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Media } from '@ionic-native/media/ngx';
import { MusiqueService } from './services/musique.service';

@NgModule({
  declarations: [AppComponent,SigninOrRegisterPageComponent,RegisterPageComponent,SigninPageComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Media, MusiqueService],
  bootstrap: [AppComponent],
})
export class AppModule {}
