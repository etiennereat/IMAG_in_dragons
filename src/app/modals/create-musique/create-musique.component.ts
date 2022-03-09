import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Musique } from 'src/app/models/Musique';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-create-musique',
  templateUrl: './create-musique.component.html',
  styleUrls: ['./create-musique.component.css']
})
export class CreateMusiqueComponent implements OnInit {

  @Input() playlistId: string;

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

  addMusique() {
    this.playlistService.addMusic(this.playlistId, new Musique('musiqueDemo','autheurDemo',"urlMusiqueDemo","musiqueDemo"));
    this.modalController.dismiss();
  }

}
