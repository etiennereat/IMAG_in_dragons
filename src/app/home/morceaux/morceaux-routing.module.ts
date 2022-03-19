import { MorceauxComponent } from './morceaux.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayMusicPageComponent } from '../play-music-page/play-music-page.component';

const routes: Routes = [
  {
    path: '',
    component: MorceauxComponent,
  },
  {
    path: 'music/:id',
    component: PlayMusicPageComponent, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MorceauxRoutingModule { }
