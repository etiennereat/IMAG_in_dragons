import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists: Playlist[] = [
    new Playlist('Item 1'),
    new Playlist('Item 2'),
    new Playlist('Item 3'),
    new Playlist('Item 4'),
  ];

  constructor() { }

  getAll() {
    return this.playlists;
  }

  getOne(id: number) {
    console.log(this.playlists, id)
    return this.playlists.find(p => p.id === id);
  }

  addPlaylist(playlist: Playlist) {
    this.playlists = this.playlists.concat(playlist);
  }

  removePlaylist(playlist: Playlist) {
    this.playlists = this.playlists.filter(p => p.id !== playlist.id);
  }

  addTodo(playlistId: number, todo: Todo) {
    const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    if (this.playlists[playlistIndex]) {
      this.playlists[playlistIndex].todos = this.playlists[playlistIndex].todos.concat(todo);
    }
  }

  removeTodo(playlistId: number, todo: Todo) {
    const playlistIndex = this.playlists.findIndex(p => p.id === playlistId);
    if (this.playlists[playlistIndex]) {
      this.playlists[playlistIndex].todos = this.playlists[playlistIndex].todos.filter(t => t.id !== todo.id);
    }
  }
}
