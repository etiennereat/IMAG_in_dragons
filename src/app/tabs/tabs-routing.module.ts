import { AlbumsComponent } from './../home/albums/albums.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 't',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'playlist',
        loadChildren: () => import('../playlist/playlist.module').then(m => m.PlaylistPageModule)
      },
      {
        path: 'albums',
        component:AlbumsComponent
      },
      {
        path: '',
        redirectTo: '/t/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/t/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}