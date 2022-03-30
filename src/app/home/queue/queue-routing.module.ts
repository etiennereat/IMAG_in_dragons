import { QueueComponent } from './queue.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayMusicPageComponent } from '../play-music-page/play-music-page.component';

const routes: Routes = [
  {
    path: '',
    component: QueueComponent,
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
export class QueueRoutingModule { }
