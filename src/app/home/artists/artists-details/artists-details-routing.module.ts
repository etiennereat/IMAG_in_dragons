import { PlayMusicPageComponent } from './../../play-music-page/play-music-page.component';
import { ArtistsDetailsComponent } from './artists-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ArtistsDetailsComponent,
  },
  {
    path: 'music/:id',
    component:PlayMusicPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistsDetailsRoutingModule { }
