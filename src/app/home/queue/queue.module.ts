import { FormsModule } from '@angular/forms';
import { QueueComponent } from './queue.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueRoutingModule } from './queue-routing.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [QueueComponent],
  imports: [
    CommonModule,
    QueueRoutingModule,
    IonicModule,
    FormsModule
  ]
})
export class QueueModule { }
