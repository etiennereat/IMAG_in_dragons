export class Musique {
    id: string;
    dateAjout: Date; 
    idAuteur: string;
    idImageStorage: string;
    idMusiqueStorage: string;
    nom: string;
    nomAlbum: string;
    urlImage: string;
    urlMusique: string;


    constructor(id: string, idAuteur: string, idImageStorage: string, nom: string, dateAjout? : Date, idMusiqueStorage? : string) {
        this.id = id;
        this.nom = nom;
        this.idAuteur = idAuteur;
        this.idImageStorage = idImageStorage;
        this.nomAlbum ?? this.nomAlbum;
        this.idMusiqueStorage ?? idMusiqueStorage;
        this.dateAjout ?? dateAjout;
    }
}
