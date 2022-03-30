import { Observable } from "rxjs";
import { Musique } from "./Musique";

export interface Playlist {
    id: string;
    nom: string;
    musiques: Observable<Musique[]>;
    canWrite: string[];
    canRead: string[];
    idUserCreateur: string;
    idImageStorage: string;
}