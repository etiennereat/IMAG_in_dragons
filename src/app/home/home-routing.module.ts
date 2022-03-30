import { ArtistsModule } from './artists/artists.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home.component';

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
    path: 'artists',
    loadChildren: () => import('./artists/artists.module').then(m => m.ArtistsModule)
  },
  {
    path: 'tracks',
    loadChildren: () => import('./morceaux/morceaux.module').then(m => m.MorceauxModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
