export class Todo {
    id; number;
    name: string;
    description: string;
    completed: boolean;

    constructor(name: string, description: string, id?: number, completed?: boolean) {
        this.id = id ?? Math.floor(Math.random() * 100) + Date.now();
        this.name = name;
        this.description = description;
        this.completed = completed ?? false;
    }
}
