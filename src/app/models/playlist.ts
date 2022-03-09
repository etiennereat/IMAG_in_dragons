import { Musique } from "./Musique";

export class Playlist {
    id: string;
    nom: string;
    musiques: Musique[];
    canWrite: string[];
    canRead: string[];
    idUserCreateur: string;
    idImageStorage: string;


    constructor(name: string, id: string, musiques: Musique[], canWrite: string[], canRead: string[], owner: string, image: string){
        this.id = id;;
        this.nom = name;
        this.musiques = musiques;
        this.canRead = canRead;
        this.canWrite = canWrite;
        this.idUserCreateur = owner;
        this.idImageStorage = image;
    }
}