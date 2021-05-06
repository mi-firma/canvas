export class PersonaMailConfig {
    id: string;
    idPersona: number;
    logo: string;
    colorBase: string;
    colorSecundario: string;
    footer: string;
    /** Establece los campos iniciales, se coloca IdPersona en 1 que es la que existe en el ambiente de pruebas */
    constructor() {
        this.id = null;
        this.idPersona = 1;
        this.logo = 'https://mifirmapru.olimpiait.com:6570/assets/img/logo-mi-firma.svg';
        this.colorBase = '#9e267d';
        this.colorSecundario = '#FFFFFF';
        this.footer = '© Olimpia IT SAS. Calle 24 # 7 - 43. Piso 16 (+57 1) 742 - 1436. El contenido de este mensaje puede ser información privilegiada y confidencial.';
    }
}
