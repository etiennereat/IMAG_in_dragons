export class Artists {
    id: string;
    nom: string;
    NbMusique:number;

    constructor(id: string, nom: string, NbMusique:number) {
        this.id = id;
        this.nom = nom;
        this.NbMusique = NbMusique;
    }
}
