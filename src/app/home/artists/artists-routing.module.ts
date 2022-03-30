import { ArtistsComponent } from './artists.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ArtistsComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('./artists-details/artists-details.module').then(m => m.ArtistsDetailsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistsRoutingModule { }
