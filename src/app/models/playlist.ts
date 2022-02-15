import { Todo } from "./todo";

export class Playlist {
    id: number;
    name: string;
    todos: Todo[];

    constructor(name: string, id?: number, todos?: Todo[]) {
        this.id = id ?? Math.floor(Math.random() * 100) + Date.now();
        this.name = name;
        this.todos = todos ?? [];
    }
}
