import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  @Input() playlistId: number;

  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController,
    private playlistService: PlaylistService) {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
  }

  addTodo() {
    this.playlistService.addTodo(this.playlistId, new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value));
    this.modalController.dismiss();
  }

}
