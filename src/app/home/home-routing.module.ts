import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home.component';
import { MorceauxComponent } from './morceaux/morceaux.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
  },
  {
    path: 'playlist',
    loadChildren: () => import('../playlist/playlist.module').then(m => m.PlaylistPageModule)
  },
  {
    path: 'albums',
    component: AlbumsComponent, 
  },
  {
    path: 'tracks',
    component: MorceauxComponent, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
