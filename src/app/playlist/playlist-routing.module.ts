import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistPage } from './playlist.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistPage,
  },{
    path: ':id',
    loadChildren: () => import('./playlist-detail/playlist-detail.module').then(m => m.PlaylistDetailModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistPageRoutingModule {}
