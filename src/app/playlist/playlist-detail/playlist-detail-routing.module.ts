import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayMusicPageComponent } from 'src/app/home/play-music-page/play-music-page.component';
import { PlaylistDetailComponent } from './playlist-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistDetailComponent,
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
export class PlaylistDetailRoutingModule {}
