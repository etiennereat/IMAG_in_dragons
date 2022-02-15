import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { PlaylistDetailRoutingModule } from './playlist-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { CreateTodoComponent } from 'src/app/modals/create-todo/create-todo.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlaylistDetailComponent,
    CreateTodoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    PlaylistDetailRoutingModule
  ]
})
export class PlaylistDetailModule { }
