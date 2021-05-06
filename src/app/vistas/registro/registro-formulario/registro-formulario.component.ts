import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/servicios/registro.service';
import { ToastrService } from 'ngx-toastr';
import { ParamsService } from 'src/app/servicios/params/params.service';

@Component({
    selector: 'app-registro-formulario',
    templateUrl: './registro-formulario.component.html',
    styleUrls: ['./registro-formulario.component.css']
})
export class RegistroFormularioComponent implements OnInit, OnDestroy {

    formRegistro = new FormGroup({
        Direccion: new FormControl('', [Validators.required]),
        Complemento: new FormControl(''),
        Departamento: new FormControl('', [Validators.required]),
        Ciudad: new FormControl('', [Validators.required])
    });

    departamentos: Array<any> = [];
    ciudades: Array<any> = [];
    ciudadesTmp: Array<any> = [];

    animObj = {
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/registro-3.json',
      };

    animObjmov = {
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/registro-3-mobile.json',
    };

    constructor(
        private router: Router,
        private paramsService: ParamsService,
        public registroService: RegistroService,
        public toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.init();
    }

    init(): void {
        if (localStorage.getItem('personaId') == null) {
            this.router.navigateByUrl('');
            return;
        }

        this.paramsService.googleAnalytics.subscribe((enabled: boolean) => {
            if (enabled) {
                (window as any).dataLayer.push({ event: 'GTMFormRegistro',
                                                gtmFormRegistroStepName: 'registro/datos/ubicacion',
                                                gtmFormRegistroStepNumber: '4' });
            }
        });

        this.departamentos = [
            {
                "ID": 1,
                "Code": "11",
                "Name": "Bogotá D.C."
            },
            {
                "ID": 14,
                "Code": "5",
                "Name": "Antioquia"
            },
            {
                "ID": 28,
                "Code": "88",
                "Name": "Archipiélago de San Andrés, Providencia y Santa Catalina"
            },
            {
                "ID": 29,
                "Code": "91",
                "Name": "Amazonas"
            },
            {
                "ID": 24,
                "Code": "8",
                "Name": "Atlántico"
            },
            {
                "ID": 25,
                "Code": "81",
                "Name": "Arauca"
            },
            {
                "ID": 2,
                "Code": "13",
                "Name": "Bolívar"
            },
            {
                "ID": 3,
                "Code": "15",
                "Name": "Boyacá"
            },
            {
                "ID": 4,
                "Code": "17",
                "Name": "Caldas"
            },
            {
                "ID": 5,
                "Code": "18",
                "Name": "Caquetá"
            },
            {
                "ID": 26,
                "Code": "85",
                "Name": "Casanare"
            },
            {
                "ID": 6,
                "Code": "19",
                "Name": "Cauca"
            },
            {
                "ID": 7,
                "Code": "20",
                "Name": "Cesar"
            },
            {
                "ID": 8,
                "Code": "23",
                "Name": "Córdoba"
            },
            {
                "ID": 9,
                "Code": "25",
                "Name": "Cundinamarca"
            },
            {
                "ID": 10,
                "Code": "27",
                "Name": "Chocó"
            },
            {
                "ID": 30,
                "Code": "94",
                "Name": "Guainía"
            },
            {
                "ID": 31,
                "Code": "95",
                "Name": "Guaviare"
            },
            {
                "ID": 12,
                "Code": "44",
                "Name": "La Guajira"
            },
            {
                "ID": 11,
                "Code": "41",
                "Name": "Huila"
            },
            {
                "ID": 13,
                "Code": "47",
                "Name": "Magdalena"
            },
            {
                "ID": 15,
                "Code": "50",
                "Name": "Meta"
            },
            {
                "ID": 16,
                "Code": "52",
                "Name": "Nariño"
            },
            {
                "ID": 17,
                "Code": "54",
                "Name": "Norte de Santander"
            },
            {
                "ID": 27,
                "Code": "86",
                "Name": "Putumayo"
            },
            {
                "ID": 18,
                "Code": "63",
                "Name": "Quindío"
            },
            {
                "ID": 19,
                "Code": "66",
                "Name": "Risaralda"
            },
            {
                "ID": 20,
                "Code": "68",
                "Name": "Santander"
            },
            {
                "ID": 21,
                "Code": "70",
                "Name": "Sucre"
            },
            {
                "ID": 22,
                "Code": "73",
                "Name": "Tolima"
            },
            {
                "ID": 23,
                "Code": "76",
                "Name": "Valle del Cauca"
            },
            {
                "ID": 32,
                "Code": "97",
                "Name": "Vaupés"
            },
            {
                "ID": 33,
                "Code": "99",
                "Name": "Vichada"
            }
        ];
    }

    findCities(id: number, event): void {
        if (event.isUserInput) {
            if (id == 1) {
                this.ciudades = [
                    {
                        "ID": 1,
                        "Code": "001",
                        "Name": "Bogotá D.C."
                    }
                ];
            }
            else if (id == 2) {
                this.ciudades = [
                    {
                        "ID": 2,
                        "Code": "001",
                        "Name": "Cartagena"
                    },
                    {
                        "ID": 3,
                        "Code": "006",
                        "Name": "Achí"
                    },
                    {
                        "ID": 4,
                        "Code": "030",
                        "Name": "Altos del Rosario"
                    },
                    {
                        "ID": 5,
                        "Code": "042",
                        "Name": "Arenal"
                    },
                    {
                        "ID": 6,
                        "Code": "052",
                        "Name": "Arjona"
                    },
                    {
                        "ID": 7,
                        "Code": "062",
                        "Name": "Arroyohondo"
                    },
                    {
                        "ID": 8,
                        "Code": "074",
                        "Name": "Barranco de Loba"
                    },
                    {
                        "ID": 9,
                        "Code": "140",
                        "Name": "Calamar"
                    },
                    {
                        "ID": 10,
                        "Code": "160",
                        "Name": "Cantagallo"
                    },
                    {
                        "ID": 11,
                        "Code": "188",
                        "Name": "Cicuco"
                    },
                    {
                        "ID": 12,
                        "Code": "212",
                        "Name": "Córdoba"
                    },
                    {
                        "ID": 13,
                        "Code": "222",
                        "Name": "Clemencia"
                    },
                    {
                        "ID": 14,
                        "Code": "244",
                        "Name": "El Carmen de Bolívar"
                    },
                    {
                        "ID": 15,
                        "Code": "248",
                        "Name": "El Guamo"
                    },
                    {
                        "ID": 16,
                        "Code": "268",
                        "Name": "El Peñón"
                    },
                    {
                        "ID": 17,
                        "Code": "300",
                        "Name": "Hatillo de Loba"
                    },
                    {
                        "ID": 18,
                        "Code": "430",
                        "Name": "Magangué"
                    },
                    {
                        "ID": 19,
                        "Code": "433",
                        "Name": "Mahates"
                    },
                    {
                        "ID": 20,
                        "Code": "440",
                        "Name": "Margarita"
                    },
                    {
                        "ID": 21,
                        "Code": "442",
                        "Name": "María la Baja"
                    },
                    {
                        "ID": 22,
                        "Code": "458",
                        "Name": "Montecristo"
                    },
                    {
                        "ID": 23,
                        "Code": "468",
                        "Name": "Mompós"
                    },
                    {
                        "ID": 24,
                        "Code": "473",
                        "Name": "Morales"
                    },
                    {
                        "ID": 25,
                        "Code": "490",
                        "Name": "Norosí"
                    },
                    {
                        "ID": 26,
                        "Code": "549",
                        "Name": "Pinillos"
                    },
                    {
                        "ID": 27,
                        "Code": "580",
                        "Name": "Regidor"
                    },
                    {
                        "ID": 28,
                        "Code": "600",
                        "Name": "Río Viejo"
                    },
                    {
                        "ID": 29,
                        "Code": "620",
                        "Name": "San Cristóbal"
                    },
                    {
                        "ID": 30,
                        "Code": "647",
                        "Name": "San Estanislao"
                    },
                    {
                        "ID": 31,
                        "Code": "650",
                        "Name": "San Fernando"
                    },
                    {
                        "ID": 32,
                        "Code": "654",
                        "Name": "San Jacinto"
                    },
                    {
                        "ID": 33,
                        "Code": "655",
                        "Name": "San Jacinto del Cauca"
                    },
                    {
                        "ID": 34,
                        "Code": "657",
                        "Name": "San Juan Nepomuceno"
                    },
                    {
                        "ID": 35,
                        "Code": "667",
                        "Name": "San Martín de Loba"
                    },
                    {
                        "ID": 36,
                        "Code": "670",
                        "Name": "San Pablo de Borbur"
                    },
                    {
                        "ID": 37,
                        "Code": "673",
                        "Name": "Santa Catalina"
                    },
                    {
                        "ID": 38,
                        "Code": "683",
                        "Name": "Santa Rosa"
                    },
                    {
                        "ID": 39,
                        "Code": "688",
                        "Name": "Santa Rosa del Sur"
                    },
                    {
                        "ID": 40,
                        "Code": "744",
                        "Name": "Simití"
                    },
                    {
                        "ID": 41,
                        "Code": "760",
                        "Name": "Soplaviento"
                    },
                    {
                        "ID": 42,
                        "Code": "780",
                        "Name": "Talaigua Nuevo"
                    },
                    {
                        "ID": 43,
                        "Code": "810",
                        "Name": "Tiquisio"
                    },
                    {
                        "ID": 44,
                        "Code": "836",
                        "Name": "Turbaco"
                    },
                    {
                        "ID": 45,
                        "Code": "838",
                        "Name": "Turbaná"
                    },
                    {
                        "ID": 46,
                        "Code": "873",
                        "Name": "Villanueva"
                    },
                    {
                        "ID": 47,
                        "Code": "894",
                        "Name": "Zambrano"
                    }
                ];
            }
            else if (id == 3) {
                this.ciudades = [
                    {
                        "ID": 48,
                        "Code": "001",
                        "Name": "Tunja"
                    },
                    {
                        "ID": 49,
                        "Code": "022",
                        "Name": "Almeida"
                    },
                    {
                        "ID": 50,
                        "Code": "047",
                        "Name": "Aquitania"
                    },
                    {
                        "ID": 51,
                        "Code": "051",
                        "Name": "Arcabuco"
                    },
                    {
                        "ID": 52,
                        "Code": "087",
                        "Name": "Belén"
                    },
                    {
                        "ID": 53,
                        "Code": "090",
                        "Name": "Berbeo"
                    },
                    {
                        "ID": 54,
                        "Code": "092",
                        "Name": "Betéitiva"
                    },
                    {
                        "ID": 55,
                        "Code": "097",
                        "Name": "Boavita"
                    },
                    {
                        "ID": 56,
                        "Code": "104",
                        "Name": "Boyacá"
                    },
                    {
                        "ID": 57,
                        "Code": "106",
                        "Name": "Briceño"
                    },
                    {
                        "ID": 58,
                        "Code": "109",
                        "Name": "Buena Vista"
                    },
                    {
                        "ID": 59,
                        "Code": "114",
                        "Name": "Busbanzá"
                    },
                    {
                        "ID": 60,
                        "Code": "131",
                        "Name": "Caldas"
                    },
                    {
                        "ID": 61,
                        "Code": "135",
                        "Name": "Campohermoso"
                    },
                    {
                        "ID": 62,
                        "Code": "162",
                        "Name": "Cerinza"
                    },
                    {
                        "ID": 63,
                        "Code": "172",
                        "Name": "Chinavita"
                    },
                    {
                        "ID": 64,
                        "Code": "176",
                        "Name": "Chiquinquirá"
                    },
                    {
                        "ID": 65,
                        "Code": "180",
                        "Name": "Chiscas"
                    },
                    {
                        "ID": 66,
                        "Code": "183",
                        "Name": "Chita"
                    },
                    {
                        "ID": 67,
                        "Code": "185",
                        "Name": "Chitaraque"
                    },
                    {
                        "ID": 68,
                        "Code": "187",
                        "Name": "Chivatá"
                    },
                    {
                        "ID": 69,
                        "Code": "189",
                        "Name": "Ciénega"
                    },
                    {
                        "ID": 70,
                        "Code": "204",
                        "Name": "Cómbita"
                    },
                    {
                        "ID": 71,
                        "Code": "212",
                        "Name": "Coper"
                    },
                    {
                        "ID": 72,
                        "Code": "215",
                        "Name": "Corrales"
                    },
                    {
                        "ID": 73,
                        "Code": "218",
                        "Name": "Covarachía"
                    },
                    {
                        "ID": 74,
                        "Code": "223",
                        "Name": "Cubará"
                    },
                    {
                        "ID": 75,
                        "Code": "224",
                        "Name": "Cucaita"
                    },
                    {
                        "ID": 76,
                        "Code": "226",
                        "Name": "Cuítiva"
                    },
                    {
                        "ID": 77,
                        "Code": "232",
                        "Name": "Chíquiza"
                    },
                    {
                        "ID": 78,
                        "Code": "236",
                        "Name": "Chivor"
                    },
                    {
                        "ID": 79,
                        "Code": "238",
                        "Name": "Duitama"
                    },
                    {
                        "ID": 80,
                        "Code": "244",
                        "Name": "El Cocuy"
                    },
                    {
                        "ID": 81,
                        "Code": "248",
                        "Name": "El Espino"
                    },
                    {
                        "ID": 82,
                        "Code": "272",
                        "Name": "Firavitoba"
                    },
                    {
                        "ID": 83,
                        "Code": "276",
                        "Name": "Floresta"
                    },
                    {
                        "ID": 84,
                        "Code": "293",
                        "Name": "Gachantivá"
                    },
                    {
                        "ID": 85,
                        "Code": "296",
                        "Name": "Gameza"
                    },
                    {
                        "ID": 86,
                        "Code": "299",
                        "Name": "Garagoa"
                    },
                    {
                        "ID": 87,
                        "Code": "317",
                        "Name": "Guacamayas"
                    },
                    {
                        "ID": 88,
                        "Code": "322",
                        "Name": "Guateque"
                    },
                    {
                        "ID": 89,
                        "Code": "325",
                        "Name": "Guayatá"
                    },
                    {
                        "ID": 90,
                        "Code": "332",
                        "Name": "Güicán"
                    },
                    {
                        "ID": 91,
                        "Code": "362",
                        "Name": "Iza"
                    },
                    {
                        "ID": 92,
                        "Code": "367",
                        "Name": "Jenesano"
                    },
                    {
                        "ID": 93,
                        "Code": "368",
                        "Name": "Jericó"
                    },
                    {
                        "ID": 94,
                        "Code": "377",
                        "Name": "Labranzagrande"
                    },
                    {
                        "ID": 95,
                        "Code": "380",
                        "Name": "La Capilla"
                    },
                    {
                        "ID": 96,
                        "Code": "401",
                        "Name": "La Victoria"
                    },
                    {
                        "ID": 97,
                        "Code": "403",
                        "Name": "La Uvita"
                    },
                    {
                        "ID": 98,
                        "Code": "407",
                        "Name": "Villa de Leyva"
                    },
                    {
                        "ID": 99,
                        "Code": "425",
                        "Name": "Macanal"
                    },
                    {
                        "ID": 100,
                        "Code": "442",
                        "Name": "Maripí"
                    },
                    {
                        "ID": 101,
                        "Code": "455",
                        "Name": "Miraflores"
                    },
                    {
                        "ID": 102,
                        "Code": "464",
                        "Name": "Mongua"
                    },
                    {
                        "ID": 103,
                        "Code": "466",
                        "Name": "Monguí"
                    },
                    {
                        "ID": 104,
                        "Code": "469",
                        "Name": "Moniquirá"
                    },
                    {
                        "ID": 105,
                        "Code": "476",
                        "Name": "Motavita"
                    },
                    {
                        "ID": 106,
                        "Code": "480",
                        "Name": "Muzo"
                    },
                    {
                        "ID": 107,
                        "Code": "491",
                        "Name": "Nobsa"
                    },
                    {
                        "ID": 108,
                        "Code": "494",
                        "Name": "Nuevo Colón"
                    },
                    {
                        "ID": 109,
                        "Code": "500",
                        "Name": "Oicatá"
                    },
                    {
                        "ID": 110,
                        "Code": "507",
                        "Name": "Otanche"
                    },
                    {
                        "ID": 111,
                        "Code": "511",
                        "Name": "Pachavita"
                    },
                    {
                        "ID": 112,
                        "Code": "514",
                        "Name": "Páez"
                    },
                    {
                        "ID": 113,
                        "Code": "516",
                        "Name": "Paipa"
                    },
                    {
                        "ID": 114,
                        "Code": "518",
                        "Name": "Pajarito"
                    },
                    {
                        "ID": 115,
                        "Code": "522",
                        "Name": "Panqueba"
                    },
                    {
                        "ID": 116,
                        "Code": "531",
                        "Name": "Pauna"
                    },
                    {
                        "ID": 117,
                        "Code": "533",
                        "Name": "Paya"
                    },
                    {
                        "ID": 118,
                        "Code": "537",
                        "Name": "Paz de Río"
                    },
                    {
                        "ID": 119,
                        "Code": "542",
                        "Name": "Pesca"
                    },
                    {
                        "ID": 120,
                        "Code": "550",
                        "Name": "Pisba"
                    },
                    {
                        "ID": 121,
                        "Code": "572",
                        "Name": "Puerto Boyacá"
                    },
                    {
                        "ID": 122,
                        "Code": "580",
                        "Name": "Quípama"
                    },
                    {
                        "ID": 123,
                        "Code": "599",
                        "Name": "Ramiriquí"
                    },
                    {
                        "ID": 124,
                        "Code": "600",
                        "Name": "Ráquira"
                    },
                    {
                        "ID": 125,
                        "Code": "621",
                        "Name": "Rondón"
                    },
                    {
                        "ID": 126,
                        "Code": "632",
                        "Name": "Saboyá"
                    },
                    {
                        "ID": 127,
                        "Code": "638",
                        "Name": "Sáchica"
                    },
                    {
                        "ID": 128,
                        "Code": "646",
                        "Name": "Samacá"
                    },
                    {
                        "ID": 129,
                        "Code": "660",
                        "Name": "San Eduardo"
                    },
                    {
                        "ID": 130,
                        "Code": "664",
                        "Name": "San José de Pare"
                    },
                    {
                        "ID": 131,
                        "Code": "667",
                        "Name": "San Luis de Gaceno"
                    },
                    {
                        "ID": 132,
                        "Code": "673",
                        "Name": "San Mateo"
                    },
                    {
                        "ID": 133,
                        "Code": "676",
                        "Name": "San Miguel de Sema"
                    },
                    {
                        "ID": 134,
                        "Code": "681",
                        "Name": "San Pablo de Borbur"
                    },
                    {
                        "ID": 135,
                        "Code": "686",
                        "Name": "Santana"
                    },
                    {
                        "ID": 136,
                        "Code": "690",
                        "Name": "Santa María"
                    },
                    {
                        "ID": 137,
                        "Code": "693",
                        "Name": "Santa Rosa de Viterbo"
                    },
                    {
                        "ID": 138,
                        "Code": "696",
                        "Name": "Santa Sofía"
                    },
                    {
                        "ID": 139,
                        "Code": "720",
                        "Name": "Sativanorte"
                    },
                    {
                        "ID": 140,
                        "Code": "723",
                        "Name": "Sativasur"
                    },
                    {
                        "ID": 141,
                        "Code": "740",
                        "Name": "Siachoque"
                    },
                    {
                        "ID": 142,
                        "Code": "753",
                        "Name": "Soatá"
                    },
                    {
                        "ID": 143,
                        "Code": "755",
                        "Name": "Socotá"
                    },
                    {
                        "ID": 144,
                        "Code": "757",
                        "Name": "Socha"
                    },
                    {
                        "ID": 145,
                        "Code": "759",
                        "Name": "Sogamoso"
                    },
                    {
                        "ID": 146,
                        "Code": "761",
                        "Name": "Somondoco"
                    },
                    {
                        "ID": 147,
                        "Code": "762",
                        "Name": "Sora"
                    },
                    {
                        "ID": 148,
                        "Code": "763",
                        "Name": "Sotaquirá"
                    },
                    {
                        "ID": 149,
                        "Code": "764",
                        "Name": "Soracá"
                    },
                    {
                        "ID": 150,
                        "Code": "774",
                        "Name": "Susacón"
                    },
                    {
                        "ID": 151,
                        "Code": "776",
                        "Name": "Sutamarchán"
                    },
                    {
                        "ID": 152,
                        "Code": "778",
                        "Name": "Sutatenza"
                    },
                    {
                        "ID": 153,
                        "Code": "790",
                        "Name": "Tasco"
                    },
                    {
                        "ID": 154,
                        "Code": "798",
                        "Name": "Tenza"
                    },
                    {
                        "ID": 155,
                        "Code": "804",
                        "Name": "Tibaná"
                    },
                    {
                        "ID": 156,
                        "Code": "806",
                        "Name": "Tibasosa"
                    },
                    {
                        "ID": 157,
                        "Code": "808",
                        "Name": "Tinjacá"
                    },
                    {
                        "ID": 158,
                        "Code": "810",
                        "Name": "Tipacoque"
                    },
                    {
                        "ID": 159,
                        "Code": "814",
                        "Name": "Toca"
                    },
                    {
                        "ID": 160,
                        "Code": "816",
                        "Name": "Togüí"
                    },
                    {
                        "ID": 161,
                        "Code": "820",
                        "Name": "Tópaga"
                    },
                    {
                        "ID": 162,
                        "Code": "822",
                        "Name": "Tota"
                    },
                    {
                        "ID": 163,
                        "Code": "832",
                        "Name": "Tununguá"
                    },
                    {
                        "ID": 164,
                        "Code": "835",
                        "Name": "Turmequé"
                    },
                    {
                        "ID": 165,
                        "Code": "837",
                        "Name": "Tuta"
                    },
                    {
                        "ID": 166,
                        "Code": "839",
                        "Name": "Tutazá"
                    },
                    {
                        "ID": 167,
                        "Code": "842",
                        "Name": "Umbita"
                    },
                    {
                        "ID": 168,
                        "Code": "861",
                        "Name": "Ventaquemada"
                    },
                    {
                        "ID": 169,
                        "Code": "879",
                        "Name": "Viracachá"
                    },
                    {
                        "ID": 170,
                        "Code": "897",
                        "Name": "Zetaquira"
                    }
                ];
            }
            else if (id == 4) {
                this.ciudades = [
                    {
                        "ID": 171,
                        "Code": "001",
                        "Name": "Manizales"
                    },
                    {
                        "ID": 172,
                        "Code": "013",
                        "Name": "Aguadas"
                    },
                    {
                        "ID": 173,
                        "Code": "042",
                        "Name": "Anserma"
                    },
                    {
                        "ID": 174,
                        "Code": "050",
                        "Name": "Aranzazu"
                    },
                    {
                        "ID": 175,
                        "Code": "088",
                        "Name": "Belalcázar"
                    },
                    {
                        "ID": 176,
                        "Code": "174",
                        "Name": "Chinchiná"
                    },
                    {
                        "ID": 177,
                        "Code": "272",
                        "Name": "Filadelfia"
                    },
                    {
                        "ID": 178,
                        "Code": "380",
                        "Name": "La Dorada"
                    },
                    {
                        "ID": 179,
                        "Code": "388",
                        "Name": "La Merced"
                    },
                    {
                        "ID": 180,
                        "Code": "433",
                        "Name": "Manzanares"
                    },
                    {
                        "ID": 181,
                        "Code": "442",
                        "Name": "Marmato"
                    },
                    {
                        "ID": 182,
                        "Code": "444",
                        "Name": "Marquetalia"
                    },
                    {
                        "ID": 183,
                        "Code": "446",
                        "Name": "Marulanda"
                    },
                    {
                        "ID": 184,
                        "Code": "486",
                        "Name": "Neira"
                    },
                    {
                        "ID": 185,
                        "Code": "495",
                        "Name": "Norcasia"
                    },
                    {
                        "ID": 186,
                        "Code": "513",
                        "Name": "Pácora"
                    },
                    {
                        "ID": 187,
                        "Code": "524",
                        "Name": "Palestina"
                    },
                    {
                        "ID": 188,
                        "Code": "541",
                        "Name": "Pensilvania"
                    },
                    {
                        "ID": 189,
                        "Code": "614",
                        "Name": "Riosucio"
                    },
                    {
                        "ID": 190,
                        "Code": "616",
                        "Name": "Risaralda"
                    },
                    {
                        "ID": 191,
                        "Code": "653",
                        "Name": "Salamina"
                    },
                    {
                        "ID": 192,
                        "Code": "662",
                        "Name": "Samaná"
                    },
                    {
                        "ID": 193,
                        "Code": "665",
                        "Name": "San José"
                    },
                    {
                        "ID": 194,
                        "Code": "777",
                        "Name": "Supía"
                    },
                    {
                        "ID": 195,
                        "Code": "867",
                        "Name": "Victoria"
                    },
                    {
                        "ID": 196,
                        "Code": "873",
                        "Name": "Villamaría"
                    },
                    {
                        "ID": 197,
                        "Code": "877",
                        "Name": "Viterbo"
                    }
                ];
            }
            else if (id == 5) {
                this.ciudades = [
                    {
                        "ID": 198,
                        "Code": "001",
                        "Name": "Florencia"
                    },
                    {
                        "ID": 199,
                        "Code": "029",
                        "Name": "Albania"
                    },
                    {
                        "ID": 200,
                        "Code": "094",
                        "Name": "Belén de Los Andaquies"
                    },
                    {
                        "ID": 201,
                        "Code": "150",
                        "Name": "Cartagena del Chairá"
                    },
                    {
                        "ID": 202,
                        "Code": "205",
                        "Name": "Curillo"
                    },
                    {
                        "ID": 203,
                        "Code": "247",
                        "Name": "El Doncello"
                    },
                    {
                        "ID": 204,
                        "Code": "256",
                        "Name": "El Paujil"
                    },
                    {
                        "ID": 205,
                        "Code": "410",
                        "Name": "La Montañita"
                    },
                    {
                        "ID": 206,
                        "Code": "460",
                        "Name": "Milán"
                    },
                    {
                        "ID": 207,
                        "Code": "479",
                        "Name": "Morelia"
                    },
                    {
                        "ID": 208,
                        "Code": "592",
                        "Name": "Puerto Rico"
                    },
                    {
                        "ID": 209,
                        "Code": "610",
                        "Name": "San José del Fragua"
                    },
                    {
                        "ID": 210,
                        "Code": "753",
                        "Name": "San Vicente del Caguán"
                    },
                    {
                        "ID": 211,
                        "Code": "756",
                        "Name": "Solano"
                    },
                    {
                        "ID": 212,
                        "Code": "785",
                        "Name": "Solita"
                    },
                    {
                        "ID": 213,
                        "Code": "860",
                        "Name": "Valparaíso"
                    }
                ];
            }
            else if (id == 6) {
                this.ciudades = [
                    {
                        "ID": 214,
                        "Code": "001",
                        "Name": "Popayán"
                    },
                    {
                        "ID": 215,
                        "Code": "022",
                        "Name": "Almaguer"
                    },
                    {
                        "ID": 216,
                        "Code": "050",
                        "Name": "Argelia"
                    },
                    {
                        "ID": 217,
                        "Code": "075",
                        "Name": "Balboa"
                    },
                    {
                        "ID": 218,
                        "Code": "100",
                        "Name": "Bolívar"
                    },
                    {
                        "ID": 219,
                        "Code": "110",
                        "Name": "Buenos Aires"
                    },
                    {
                        "ID": 220,
                        "Code": "130",
                        "Name": "Cajibío"
                    },
                    {
                        "ID": 221,
                        "Code": "137",
                        "Name": "Caldono"
                    },
                    {
                        "ID": 222,
                        "Code": "142",
                        "Name": "Caloto"
                    },
                    {
                        "ID": 223,
                        "Code": "212",
                        "Name": "Corinto"
                    },
                    {
                        "ID": 224,
                        "Code": "256",
                        "Name": "El Tambo"
                    },
                    {
                        "ID": 225,
                        "Code": "290",
                        "Name": "Florencia"
                    },
                    {
                        "ID": 226,
                        "Code": "300",
                        "Name": "Guachené"
                    },
                    {
                        "ID": 227,
                        "Code": "318",
                        "Name": "Guapi"
                    },
                    {
                        "ID": 228,
                        "Code": "355",
                        "Name": "Inzá"
                    },
                    {
                        "ID": 229,
                        "Code": "364",
                        "Name": "Jambaló"
                    },
                    {
                        "ID": 230,
                        "Code": "392",
                        "Name": "La Sierra"
                    },
                    {
                        "ID": 231,
                        "Code": "397",
                        "Name": "La Vega"
                    },
                    {
                        "ID": 232,
                        "Code": "418",
                        "Name": "López"
                    },
                    {
                        "ID": 233,
                        "Code": "450",
                        "Name": "Mercaderes"
                    },
                    {
                        "ID": 234,
                        "Code": "455",
                        "Name": "Miranda"
                    },
                    {
                        "ID": 235,
                        "Code": "473",
                        "Name": "Morales"
                    },
                    {
                        "ID": 236,
                        "Code": "513",
                        "Name": "Padilla"
                    },
                    {
                        "ID": 237,
                        "Code": "517",
                        "Name": "Páez"
                    },
                    {
                        "ID": 238,
                        "Code": "522",
                        "Name": "Rosas"
                    },
                    {
                        "ID": 239,
                        "Code": "532",
                        "Name": "Patía"
                    },
                    {
                        "ID": 240,
                        "Code": "533",
                        "Name": "Piamonte"
                    },
                    {
                        "ID": 241,
                        "Code": "548",
                        "Name": "Piendamó"
                    },
                    {
                        "ID": 242,
                        "Code": "573",
                        "Name": "Puerto Tejada"
                    },
                    {
                        "ID": 243,
                        "Code": "585",
                        "Name": "Puracé"
                    },
                    {
                        "ID": 244,
                        "Code": "593",
                        "Name": "San Sebastián"
                    },
                    {
                        "ID": 245,
                        "Code": "598",
                        "Name": "Santander de Quilichao"
                    },
                    {
                        "ID": 246,
                        "Code": "701",
                        "Name": "Santa Rosa"
                    },
                    {
                        "ID": 247,
                        "Code": "743",
                        "Name": "Silvia"
                    },
                    {
                        "ID": 248,
                        "Code": "760",
                        "Name": "Sotara"
                    },
                    {
                        "ID": 249,
                        "Code": "780",
                        "Name": "Suárez"
                    },
                    {
                        "ID": 250,
                        "Code": "785",
                        "Name": "Sucre"
                    },
                    {
                        "ID": 251,
                        "Code": "807",
                        "Name": "Timbío"
                    },
                    {
                        "ID": 252,
                        "Code": "809",
                        "Name": "Timbiquí"
                    },
                    {
                        "ID": 253,
                        "Code": "821",
                        "Name": "Toribio"
                    },
                    {
                        "ID": 254,
                        "Code": "824",
                        "Name": "Totoró"
                    },
                    {
                        "ID": 255,
                        "Code": "845",
                        "Name": "Villa Rica"
                    }
                ];
            }
            else if (id == 7) {
                this.ciudades = [
                    {
                        "ID": 256,
                        "Code": "001",
                        "Name": "Valledupar"
                    },
                    {
                        "ID": 257,
                        "Code": "011",
                        "Name": "Aguachica"
                    },
                    {
                        "ID": 258,
                        "Code": "013",
                        "Name": "Agustín Codazzi"
                    },
                    {
                        "ID": 259,
                        "Code": "032",
                        "Name": "Astrea"
                    },
                    {
                        "ID": 260,
                        "Code": "045",
                        "Name": "Becerril"
                    },
                    {
                        "ID": 261,
                        "Code": "060",
                        "Name": "Bosconia"
                    },
                    {
                        "ID": 262,
                        "Code": "175",
                        "Name": "Chimichagua"
                    },
                    {
                        "ID": 263,
                        "Code": "178",
                        "Name": "Chiriguaná"
                    },
                    {
                        "ID": 264,
                        "Code": "228",
                        "Name": "Curumaní"
                    },
                    {
                        "ID": 265,
                        "Code": "238",
                        "Name": "El Copey"
                    },
                    {
                        "ID": 266,
                        "Code": "250",
                        "Name": "El Paso"
                    },
                    {
                        "ID": 267,
                        "Code": "295",
                        "Name": "Gamarra"
                    },
                    {
                        "ID": 268,
                        "Code": "310",
                        "Name": "González"
                    },
                    {
                        "ID": 269,
                        "Code": "383",
                        "Name": "La Gloria"
                    },
                    {
                        "ID": 270,
                        "Code": "400",
                        "Name": "La Jagua de Ibirico"
                    },
                    {
                        "ID": 271,
                        "Code": "443",
                        "Name": "Manaure"
                    },
                    {
                        "ID": 272,
                        "Code": "517",
                        "Name": "Pailitas"
                    },
                    {
                        "ID": 273,
                        "Code": "550",
                        "Name": "Pelaya"
                    },
                    {
                        "ID": 274,
                        "Code": "570",
                        "Name": "Pueblo Bello"
                    },
                    {
                        "ID": 275,
                        "Code": "614",
                        "Name": "Río de Oro"
                    },
                    {
                        "ID": 276,
                        "Code": "621",
                        "Name": "La Paz"
                    },
                    {
                        "ID": 277,
                        "Code": "810",
                        "Name": "San Alberto"
                    },
                    {
                        "ID": 278,
                        "Code": "850",
                        "Name": "San Diego"
                    },
                    {
                        "ID": 279,
                        "Code": "870",
                        "Name": "San Martín"
                    },
                    {
                        "ID": 280,
                        "Code": "887",
                        "Name": "Tamalameque"
                    }
                ];
            }
            else if (id == 8) {
                this.ciudades = [
                    {
                        "ID": 281,
                        "Code": "001",
                        "Name": "Montería"
                    },
                    {
                        "ID": 282,
                        "Code": "068",
                        "Name": "Ayapel"
                    },
                    {
                        "ID": 283,
                        "Code": "079",
                        "Name": "Buenavista"
                    },
                    {
                        "ID": 284,
                        "Code": "090",
                        "Name": "Canalete"
                    },
                    {
                        "ID": 285,
                        "Code": "162",
                        "Name": "Cereté"
                    },
                    {
                        "ID": 286,
                        "Code": "168",
                        "Name": "Chimá"
                    },
                    {
                        "ID": 287,
                        "Code": "182",
                        "Name": "Chinú"
                    },
                    {
                        "ID": 288,
                        "Code": "189",
                        "Name": "Ciénaga de Oro"
                    },
                    {
                        "ID": 289,
                        "Code": "300",
                        "Name": "Cotorra"
                    },
                    {
                        "ID": 290,
                        "Code": "350",
                        "Name": "La Apartada"
                    },
                    {
                        "ID": 291,
                        "Code": "417",
                        "Name": "Lorica"
                    },
                    {
                        "ID": 292,
                        "Code": "419",
                        "Name": "Los Córdobas"
                    },
                    {
                        "ID": 293,
                        "Code": "464",
                        "Name": "Momil"
                    },
                    {
                        "ID": 294,
                        "Code": "466",
                        "Name": "Montelíbano"
                    },
                    {
                        "ID": 295,
                        "Code": "500",
                        "Name": "Moñitos"
                    },
                    {
                        "ID": 296,
                        "Code": "555",
                        "Name": "Planeta Rica"
                    },
                    {
                        "ID": 297,
                        "Code": "570",
                        "Name": "Pueblo Nuevo"
                    },
                    {
                        "ID": 298,
                        "Code": "574",
                        "Name": "Puerto Escondido"
                    },
                    {
                        "ID": 299,
                        "Code": "580",
                        "Name": "Puerto Libertador"
                    },
                    {
                        "ID": 300,
                        "Code": "586",
                        "Name": "Purísima"
                    },
                    {
                        "ID": 301,
                        "Code": "660",
                        "Name": "Sahagún"
                    },
                    {
                        "ID": 302,
                        "Code": "670",
                        "Name": "San Andrés Sotavento"
                    },
                    {
                        "ID": 303,
                        "Code": "672",
                        "Name": "San Antero"
                    },
                    {
                        "ID": 304,
                        "Code": "675",
                        "Name": "San Bernardo del Viento"
                    },
                    {
                        "ID": 305,
                        "Code": "678",
                        "Name": "San Carlos"
                    },
                    {
                        "ID": 306,
                        "Code": "682",
                        "Name": "San José de Uré"
                    },
                    {
                        "ID": 307,
                        "Code": "686",
                        "Name": "San Pelayo"
                    },
                    {
                        "ID": 308,
                        "Code": "807",
                        "Name": "Tierralta"
                    },
                    {
                        "ID": 309,
                        "Code": "815",
                        "Name": "Tuchín"
                    },
                    {
                        "ID": 310,
                        "Code": "855",
                        "Name": "Valencia"
                    }
                ];
            }
            else if (id == 9) {
                this.ciudades = [
                    {
                        "ID": 311,
                        "Code": "001",
                        "Name": "Agua de Dios"
                    },
                    {
                        "ID": 312,
                        "Code": "019",
                        "Name": "Albán"
                    },
                    {
                        "ID": 313,
                        "Code": "035",
                        "Name": "Anapoima"
                    },
                    {
                        "ID": 314,
                        "Code": "040",
                        "Name": "Anolaima"
                    },
                    {
                        "ID": 315,
                        "Code": "053",
                        "Name": "Arbeláez"
                    },
                    {
                        "ID": 316,
                        "Code": "086",
                        "Name": "Beltrán"
                    },
                    {
                        "ID": 317,
                        "Code": "095",
                        "Name": "Bituima"
                    },
                    {
                        "ID": 318,
                        "Code": "099",
                        "Name": "Bojacá"
                    },
                    {
                        "ID": 319,
                        "Code": "120",
                        "Name": "Cabrera"
                    },
                    {
                        "ID": 320,
                        "Code": "123",
                        "Name": "Cachipay"
                    },
                    {
                        "ID": 321,
                        "Code": "126",
                        "Name": "Cajicá"
                    },
                    {
                        "ID": 322,
                        "Code": "148",
                        "Name": "Caparrapí"
                    },
                    {
                        "ID": 323,
                        "Code": "151",
                        "Name": "Caqueza"
                    },
                    {
                        "ID": 324,
                        "Code": "154",
                        "Name": "Carmen de Carupa"
                    },
                    {
                        "ID": 325,
                        "Code": "168",
                        "Name": "Chaguaní"
                    },
                    {
                        "ID": 326,
                        "Code": "175",
                        "Name": "Chía"
                    },
                    {
                        "ID": 327,
                        "Code": "178",
                        "Name": "Chipaque"
                    },
                    {
                        "ID": 328,
                        "Code": "181",
                        "Name": "Choachí"
                    },
                    {
                        "ID": 329,
                        "Code": "183",
                        "Name": "Chocontá"
                    },
                    {
                        "ID": 330,
                        "Code": "200",
                        "Name": "Cogua"
                    },
                    {
                        "ID": 331,
                        "Code": "214",
                        "Name": "Cota"
                    },
                    {
                        "ID": 332,
                        "Code": "224",
                        "Name": "Cucunubá"
                    },
                    {
                        "ID": 333,
                        "Code": "245",
                        "Name": "El Colegio"
                    },
                    {
                        "ID": 334,
                        "Code": "258",
                        "Name": "El Peñón"
                    },
                    {
                        "ID": 335,
                        "Code": "260",
                        "Name": "El Rosal"
                    },
                    {
                        "ID": 336,
                        "Code": "269",
                        "Name": "Facatativá"
                    },
                    {
                        "ID": 337,
                        "Code": "279",
                        "Name": "Fomeque"
                    },
                    {
                        "ID": 338,
                        "Code": "281",
                        "Name": "Fosca"
                    },
                    {
                        "ID": 339,
                        "Code": "286",
                        "Name": "Funza"
                    },
                    {
                        "ID": 340,
                        "Code": "288",
                        "Name": "Fúquene"
                    },
                    {
                        "ID": 341,
                        "Code": "290",
                        "Name": "Fusagasugá"
                    },
                    {
                        "ID": 342,
                        "Code": "293",
                        "Name": "Gachala"
                    },
                    {
                        "ID": 343,
                        "Code": "295",
                        "Name": "Gachancipá"
                    },
                    {
                        "ID": 344,
                        "Code": "297",
                        "Name": "Gachetá"
                    },
                    {
                        "ID": 345,
                        "Code": "299",
                        "Name": "Gama"
                    },
                    {
                        "ID": 346,
                        "Code": "307",
                        "Name": "Girardot"
                    },
                    {
                        "ID": 347,
                        "Code": "312",
                        "Name": "Granada"
                    },
                    {
                        "ID": 348,
                        "Code": "317",
                        "Name": "Guachetá"
                    },
                    {
                        "ID": 349,
                        "Code": "320",
                        "Name": "Guaduas"
                    },
                    {
                        "ID": 350,
                        "Code": "322",
                        "Name": "Guasca"
                    },
                    {
                        "ID": 351,
                        "Code": "324",
                        "Name": "Guataquí"
                    },
                    {
                        "ID": 352,
                        "Code": "326",
                        "Name": "Guatavita"
                    },
                    {
                        "ID": 353,
                        "Code": "328",
                        "Name": "Guayabal de Siquima"
                    },
                    {
                        "ID": 354,
                        "Code": "335",
                        "Name": "Guayabetal"
                    },
                    {
                        "ID": 355,
                        "Code": "339",
                        "Name": "Gutiérrez"
                    },
                    {
                        "ID": 356,
                        "Code": "368",
                        "Name": "Jerusalén"
                    },
                    {
                        "ID": 357,
                        "Code": "372",
                        "Name": "Junín"
                    },
                    {
                        "ID": 358,
                        "Code": "377",
                        "Name": "La Calera"
                    },
                    {
                        "ID": 359,
                        "Code": "386",
                        "Name": "La Mesa"
                    },
                    {
                        "ID": 360,
                        "Code": "394",
                        "Name": "La Palma"
                    },
                    {
                        "ID": 361,
                        "Code": "398",
                        "Name": "La Peña"
                    },
                    {
                        "ID": 362,
                        "Code": "402",
                        "Name": "La Vega"
                    },
                    {
                        "ID": 363,
                        "Code": "407",
                        "Name": "Lenguazaque"
                    },
                    {
                        "ID": 364,
                        "Code": "426",
                        "Name": "Macheta"
                    },
                    {
                        "ID": 365,
                        "Code": "430",
                        "Name": "Madrid"
                    },
                    {
                        "ID": 366,
                        "Code": "436",
                        "Name": "Manta"
                    },
                    {
                        "ID": 367,
                        "Code": "438",
                        "Name": "Medina"
                    },
                    {
                        "ID": 368,
                        "Code": "473",
                        "Name": "Mosquera"
                    },
                    {
                        "ID": 369,
                        "Code": "483",
                        "Name": "Nariño"
                    },
                    {
                        "ID": 370,
                        "Code": "486",
                        "Name": "Nemocón"
                    },
                    {
                        "ID": 371,
                        "Code": "488",
                        "Name": "Nilo"
                    },
                    {
                        "ID": 372,
                        "Code": "489",
                        "Name": "Nimaima"
                    },
                    {
                        "ID": 373,
                        "Code": "491",
                        "Name": "Nocaima"
                    },
                    {
                        "ID": 374,
                        "Code": "506",
                        "Name": "Venecia"
                    },
                    {
                        "ID": 375,
                        "Code": "513",
                        "Name": "Pacho"
                    },
                    {
                        "ID": 376,
                        "Code": "518",
                        "Name": "Paime"
                    },
                    {
                        "ID": 377,
                        "Code": "524",
                        "Name": "Pandi"
                    },
                    {
                        "ID": 378,
                        "Code": "530",
                        "Name": "Paratebueno"
                    },
                    {
                        "ID": 379,
                        "Code": "535",
                        "Name": "Pasca"
                    },
                    {
                        "ID": 380,
                        "Code": "572",
                        "Name": "Puerto Salgar"
                    },
                    {
                        "ID": 381,
                        "Code": "580",
                        "Name": "Pulí"
                    },
                    {
                        "ID": 382,
                        "Code": "592",
                        "Name": "Quebradanegra"
                    },
                    {
                        "ID": 383,
                        "Code": "594",
                        "Name": "Quetame"
                    },
                    {
                        "ID": 384,
                        "Code": "596",
                        "Name": "Quipile"
                    },
                    {
                        "ID": 385,
                        "Code": "599",
                        "Name": "Apulo"
                    },
                    {
                        "ID": 386,
                        "Code": "612",
                        "Name": "Ricaurte"
                    },
                    {
                        "ID": 387,
                        "Code": "645",
                        "Name": "San Antonio del Tequendama"
                    },
                    {
                        "ID": 388,
                        "Code": "649",
                        "Name": "San Bernardo"
                    },
                    {
                        "ID": 389,
                        "Code": "653",
                        "Name": "San Cayetano"
                    },
                    {
                        "ID": 390,
                        "Code": "658",
                        "Name": "San Francisco"
                    },
                    {
                        "ID": 391,
                        "Code": "662",
                        "Name": "San Juan de Río Seco"
                    },
                    {
                        "ID": 392,
                        "Code": "718",
                        "Name": "Sasaima"
                    },
                    {
                        "ID": 393,
                        "Code": "736",
                        "Name": "Sesquilé"
                    },
                    {
                        "ID": 394,
                        "Code": "740",
                        "Name": "Sibaté"
                    },
                    {
                        "ID": 395,
                        "Code": "743",
                        "Name": "Silvania"
                    },
                    {
                        "ID": 396,
                        "Code": "745",
                        "Name": "Simijaca"
                    },
                    {
                        "ID": 397,
                        "Code": "754",
                        "Name": "Soacha"
                    },
                    {
                        "ID": 398,
                        "Code": "758",
                        "Name": "Sopó"
                    },
                    {
                        "ID": 399,
                        "Code": "769",
                        "Name": "Subachoque"
                    },
                    {
                        "ID": 400,
                        "Code": "772",
                        "Name": "Suesca"
                    },
                    {
                        "ID": 401,
                        "Code": "777",
                        "Name": "Supatá"
                    },
                    {
                        "ID": 402,
                        "Code": "779",
                        "Name": "Susa"
                    },
                    {
                        "ID": 403,
                        "Code": "781",
                        "Name": "Sutatausa"
                    },
                    {
                        "ID": 404,
                        "Code": "785",
                        "Name": "Tabio"
                    },
                    {
                        "ID": 405,
                        "Code": "793",
                        "Name": "Tausa"
                    },
                    {
                        "ID": 406,
                        "Code": "797",
                        "Name": "Tena"
                    },
                    {
                        "ID": 407,
                        "Code": "799",
                        "Name": "Tenjo"
                    },
                    {
                        "ID": 408,
                        "Code": "805",
                        "Name": "Tibacuy"
                    },
                    {
                        "ID": 409,
                        "Code": "807",
                        "Name": "Tibirita"
                    },
                    {
                        "ID": 410,
                        "Code": "815",
                        "Name": "Tocaima"
                    },
                    {
                        "ID": 411,
                        "Code": "817",
                        "Name": "Tocancipá"
                    },
                    {
                        "ID": 412,
                        "Code": "823",
                        "Name": "Topaipí"
                    },
                    {
                        "ID": 413,
                        "Code": "839",
                        "Name": "Ubalá"
                    },
                    {
                        "ID": 414,
                        "Code": "841",
                        "Name": "Ubaque"
                    },
                    {
                        "ID": 415,
                        "Code": "843",
                        "Name": "Villa de San Diego de Ubate"
                    },
                    {
                        "ID": 416,
                        "Code": "845",
                        "Name": "Une"
                    },
                    {
                        "ID": 417,
                        "Code": "851",
                        "Name": "Útica"
                    },
                    {
                        "ID": 418,
                        "Code": "862",
                        "Name": "Vergara"
                    },
                    {
                        "ID": 419,
                        "Code": "867",
                        "Name": "Vianí"
                    },
                    {
                        "ID": 420,
                        "Code": "871",
                        "Name": "Villagómez"
                    },
                    {
                        "ID": 421,
                        "Code": "873",
                        "Name": "Villapinzón"
                    },
                    {
                        "ID": 422,
                        "Code": "875",
                        "Name": "Villeta"
                    },
                    {
                        "ID": 423,
                        "Code": "878",
                        "Name": "Viotá"
                    },
                    {
                        "ID": 424,
                        "Code": "885",
                        "Name": "Yacopí"
                    },
                    {
                        "ID": 425,
                        "Code": "898",
                        "Name": "Zipacón"
                    },
                    {
                        "ID": 426,
                        "Code": "899",
                        "Name": "Zipaquirá"
                    }
                ];
            }
            else if (id == 10) {
                this.ciudades = [
                    {
                        "ID": 427,
                        "Code": "001",
                        "Name": "Quibdó"
                    },
                    {
                        "ID": 428,
                        "Code": "006",
                        "Name": "Acandí"
                    },
                    {
                        "ID": 429,
                        "Code": "025",
                        "Name": "Alto Baudo"
                    },
                    {
                        "ID": 430,
                        "Code": "050",
                        "Name": "Atrato"
                    },
                    {
                        "ID": 431,
                        "Code": "073",
                        "Name": "Bagadó"
                    },
                    {
                        "ID": 432,
                        "Code": "075",
                        "Name": "Bahía Solano"
                    },
                    {
                        "ID": 433,
                        "Code": "077",
                        "Name": "Bajo Baudó"
                    },
                    {
                        "ID": 434,
                        "Code": "086",
                        "Name": "Belén de Bajira"
                    },
                    {
                        "ID": 435,
                        "Code": "099",
                        "Name": "Bojaya"
                    },
                    {
                        "ID": 436,
                        "Code": "135",
                        "Name": "El Cantón del San Pablo"
                    },
                    {
                        "ID": 437,
                        "Code": "150",
                        "Name": "Carmen del Darien"
                    },
                    {
                        "ID": 438,
                        "Code": "160",
                        "Name": "Cértegui"
                    },
                    {
                        "ID": 439,
                        "Code": "205",
                        "Name": "Condoto"
                    },
                    {
                        "ID": 440,
                        "Code": "245",
                        "Name": "El Carmen de Atrato"
                    },
                    {
                        "ID": 441,
                        "Code": "250",
                        "Name": "El Litoral del San Juan"
                    },
                    {
                        "ID": 442,
                        "Code": "361",
                        "Name": "Istmina"
                    },
                    {
                        "ID": 443,
                        "Code": "372",
                        "Name": "Juradó"
                    },
                    {
                        "ID": 444,
                        "Code": "413",
                        "Name": "Lloró"
                    },
                    {
                        "ID": 445,
                        "Code": "425",
                        "Name": "Medio Atrato"
                    },
                    {
                        "ID": 446,
                        "Code": "430",
                        "Name": "Medio Baudó"
                    },
                    {
                        "ID": 447,
                        "Code": "450",
                        "Name": "Medio San Juan"
                    },
                    {
                        "ID": 448,
                        "Code": "491",
                        "Name": "Nóvita"
                    },
                    {
                        "ID": 449,
                        "Code": "495",
                        "Name": "Nuquí"
                    },
                    {
                        "ID": 450,
                        "Code": "580",
                        "Name": "Río Iro"
                    },
                    {
                        "ID": 451,
                        "Code": "600",
                        "Name": "Río Quito"
                    },
                    {
                        "ID": 452,
                        "Code": "615",
                        "Name": "Riosucio"
                    },
                    {
                        "ID": 453,
                        "Code": "660",
                        "Name": "San José del Palmar"
                    },
                    {
                        "ID": 454,
                        "Code": "745",
                        "Name": "Sipí"
                    },
                    {
                        "ID": 455,
                        "Code": "787",
                        "Name": "Tadó"
                    },
                    {
                        "ID": 456,
                        "Code": "800",
                        "Name": "Unguía"
                    },
                    {
                        "ID": 457,
                        "Code": "810",
                        "Name": "Unión Panamericana"
                    }
                ];
            }
            else if (id == 11) {
                this.ciudades = [
                    {
                        "ID": 458,
                        "Code": "001",
                        "Name": "Neiva"
                    },
                    {
                        "ID": 459,
                        "Code": "006",
                        "Name": "Acevedo"
                    },
                    {
                        "ID": 460,
                        "Code": "013",
                        "Name": "Agrado"
                    },
                    {
                        "ID": 461,
                        "Code": "016",
                        "Name": "Aipe"
                    },
                    {
                        "ID": 462,
                        "Code": "020",
                        "Name": "Algeciras"
                    },
                    {
                        "ID": 463,
                        "Code": "026",
                        "Name": "Altamira"
                    },
                    {
                        "ID": 464,
                        "Code": "078",
                        "Name": "Baraya"
                    },
                    {
                        "ID": 465,
                        "Code": "132",
                        "Name": "Campoalegre"
                    },
                    {
                        "ID": 466,
                        "Code": "206",
                        "Name": "Colombia"
                    },
                    {
                        "ID": 467,
                        "Code": "244",
                        "Name": "Elías"
                    },
                    {
                        "ID": 468,
                        "Code": "298",
                        "Name": "Garzón"
                    },
                    {
                        "ID": 469,
                        "Code": "306",
                        "Name": "Gigante"
                    },
                    {
                        "ID": 470,
                        "Code": "319",
                        "Name": "Guadalupe"
                    },
                    {
                        "ID": 471,
                        "Code": "349",
                        "Name": "Hobo"
                    },
                    {
                        "ID": 472,
                        "Code": "357",
                        "Name": "Iquira"
                    },
                    {
                        "ID": 473,
                        "Code": "359",
                        "Name": "Isnos"
                    },
                    {
                        "ID": 474,
                        "Code": "378",
                        "Name": "La Argentina"
                    },
                    {
                        "ID": 475,
                        "Code": "396",
                        "Name": "La Plata"
                    },
                    {
                        "ID": 476,
                        "Code": "483",
                        "Name": "Nátaga"
                    },
                    {
                        "ID": 477,
                        "Code": "503",
                        "Name": "Oporapa"
                    },
                    {
                        "ID": 478,
                        "Code": "518",
                        "Name": "Paicol"
                    },
                    {
                        "ID": 479,
                        "Code": "524",
                        "Name": "Palermo"
                    },
                    {
                        "ID": 480,
                        "Code": "530",
                        "Name": "Palestina"
                    },
                    {
                        "ID": 481,
                        "Code": "548",
                        "Name": "Pital"
                    },
                    {
                        "ID": 482,
                        "Code": "551",
                        "Name": "Pitalito"
                    },
                    {
                        "ID": 483,
                        "Code": "615",
                        "Name": "Rivera"
                    },
                    {
                        "ID": 484,
                        "Code": "660",
                        "Name": "Saladoblanco"
                    },
                    {
                        "ID": 485,
                        "Code": "668",
                        "Name": "San Agustín"
                    },
                    {
                        "ID": 486,
                        "Code": "676",
                        "Name": "Santa María"
                    },
                    {
                        "ID": 487,
                        "Code": "770",
                        "Name": "Suaza"
                    },
                    {
                        "ID": 488,
                        "Code": "791",
                        "Name": "Tarqui"
                    },
                    {
                        "ID": 489,
                        "Code": "797",
                        "Name": "Tesalia"
                    },
                    {
                        "ID": 490,
                        "Code": "799",
                        "Name": "Tello"
                    },
                    {
                        "ID": 491,
                        "Code": "801",
                        "Name": "Teruel"
                    },
                    {
                        "ID": 492,
                        "Code": "807",
                        "Name": "Timaná"
                    },
                    {
                        "ID": 493,
                        "Code": "872",
                        "Name": "Villavieja"
                    },
                    {
                        "ID": 494,
                        "Code": "885",
                        "Name": "Yaguará"
                    }
                ];
            }
            else if (id == 12) {
                this.ciudades = [
                    {
                        "ID": 495,
                        "Code": "001",
                        "Name": "Riohacha"
                    },
                    {
                        "ID": 496,
                        "Code": "035",
                        "Name": "Albania"
                    },
                    {
                        "ID": 497,
                        "Code": "078",
                        "Name": "Barrancas"
                    },
                    {
                        "ID": 498,
                        "Code": "090",
                        "Name": "Dibula"
                    },
                    {
                        "ID": 499,
                        "Code": "098",
                        "Name": "Distracción"
                    },
                    {
                        "ID": 500,
                        "Code": "110",
                        "Name": "El Molino"
                    },
                    {
                        "ID": 501,
                        "Code": "279",
                        "Name": "Fonseca"
                    },
                    {
                        "ID": 502,
                        "Code": "378",
                        "Name": "Hatonuevo"
                    },
                    {
                        "ID": 503,
                        "Code": "420",
                        "Name": "La Jagua del Pilar"
                    },
                    {
                        "ID": 504,
                        "Code": "430",
                        "Name": "Maicao"
                    },
                    {
                        "ID": 505,
                        "Code": "560",
                        "Name": "Manaure"
                    },
                    {
                        "ID": 506,
                        "Code": "650",
                        "Name": "San Juan del Cesar"
                    },
                    {
                        "ID": 507,
                        "Code": "847",
                        "Name": "Uribia"
                    },
                    {
                        "ID": 508,
                        "Code": "855",
                        "Name": "Urumita"
                    },
                    {
                        "ID": 509,
                        "Code": "874",
                        "Name": "Villanueva"
                    }
                ];
            }
            else if (id == 13) {
                this.ciudades = [
                    {
                        "ID": 510,
                        "Code": "001",
                        "Name": "Santa Marta"
                    },
                    {
                        "ID": 511,
                        "Code": "030",
                        "Name": "Algarrobo"
                    },
                    {
                        "ID": 512,
                        "Code": "053",
                        "Name": "Aracataca"
                    },
                    {
                        "ID": 513,
                        "Code": "058",
                        "Name": "Ariguaní"
                    },
                    {
                        "ID": 514,
                        "Code": "161",
                        "Name": "Cerro San Antonio"
                    },
                    {
                        "ID": 515,
                        "Code": "170",
                        "Name": "Chivolo"
                    },
                    {
                        "ID": 516,
                        "Code": "189",
                        "Name": "Ciénaga"
                    },
                    {
                        "ID": 517,
                        "Code": "205",
                        "Name": "Concordia"
                    },
                    {
                        "ID": 518,
                        "Code": "245",
                        "Name": "El Banco"
                    },
                    {
                        "ID": 519,
                        "Code": "258",
                        "Name": "El Piñon"
                    },
                    {
                        "ID": 520,
                        "Code": "268",
                        "Name": "El Retén"
                    },
                    {
                        "ID": 521,
                        "Code": "288",
                        "Name": "Fundación"
                    },
                    {
                        "ID": 522,
                        "Code": "318",
                        "Name": "Guamal"
                    },
                    {
                        "ID": 523,
                        "Code": "460",
                        "Name": "Nueva Granada"
                    },
                    {
                        "ID": 524,
                        "Code": "541",
                        "Name": "Pedraza"
                    },
                    {
                        "ID": 525,
                        "Code": "545",
                        "Name": "Pijiño del Carmen"
                    },
                    {
                        "ID": 526,
                        "Code": "551",
                        "Name": "Pivijay"
                    },
                    {
                        "ID": 527,
                        "Code": "555",
                        "Name": "Plato"
                    },
                    {
                        "ID": 528,
                        "Code": "570",
                        "Name": "Pueblo Viejo"
                    },
                    {
                        "ID": 529,
                        "Code": "605",
                        "Name": "Remolino"
                    },
                    {
                        "ID": 530,
                        "Code": "660",
                        "Name": "Sabanas de San Angel"
                    },
                    {
                        "ID": 531,
                        "Code": "675",
                        "Name": "Salamina"
                    },
                    {
                        "ID": 532,
                        "Code": "692",
                        "Name": "San Sebastián de Buenavista"
                    },
                    {
                        "ID": 533,
                        "Code": "703",
                        "Name": "San Zenón"
                    },
                    {
                        "ID": 534,
                        "Code": "707",
                        "Name": "Santa Ana"
                    },
                    {
                        "ID": 535,
                        "Code": "720",
                        "Name": "Santa Bárbara de Pinto"
                    },
                    {
                        "ID": 536,
                        "Code": "745",
                        "Name": "Sitionuevo"
                    },
                    {
                        "ID": 537,
                        "Code": "798",
                        "Name": "Tenerife"
                    },
                    {
                        "ID": 538,
                        "Code": "960",
                        "Name": "Zapayán"
                    },
                    {
                        "ID": 539,
                        "Code": "980",
                        "Name": "Zona Bananera"
                    }
                ];
            }
            else if (id == 14) {
                this.ciudades = [
                    {
                        "ID": 540,
                        "Code": "00",
                        "Name": "La Unión"
                    },
                    {
                        "ID": 541,
                        "Code": "01",
                        "Name": "Ciudad Bolívar"
                    },
                    {
                        "ID": 542,
                        "Code": "01",
                        "Name": "Medellín"
                    },
                    {
                        "ID": 543,
                        "Code": "01",
                        "Name": "Olaya"
                    },
                    {
                        "ID": 544,
                        "Code": "02",
                        "Name": "Abejorral"
                    },
                    {
                        "ID": 545,
                        "Code": "04",
                        "Name": "Abriaquí"
                    },
                    {
                        "ID": 546,
                        "Code": "04",
                        "Name": "Remedios"
                    },
                    {
                        "ID": 547,
                        "Code": "06",
                        "Name": "Concepción"
                    },
                    {
                        "ID": 548,
                        "Code": "06",
                        "Name": "Giraldo"
                    },
                    {
                        "ID": 549,
                        "Code": "07",
                        "Name": "Briceño"
                    },
                    {
                        "ID": 550,
                        "Code": "07",
                        "Name": "Retiro"
                    },
                    {
                        "ID": 551,
                        "Code": "08",
                        "Name": "Girardota"
                    },
                    {
                        "ID": 552,
                        "Code": "09",
                        "Name": "Concordia"
                    },
                    {
                        "ID": 553,
                        "Code": "09",
                        "Name": "Titiribí"
                    },
                    {
                        "ID": 554,
                        "Code": "10",
                        "Name": "Gómez Plata"
                    },
                    {
                        "ID": 555,
                        "Code": "11",
                        "Name": "Liborina"
                    },
                    {
                        "ID": 556,
                        "Code": "12",
                        "Name": "Copacabana"
                    },
                    {
                        "ID": 557,
                        "Code": "13",
                        "Name": "Buriticá"
                    },
                    {
                        "ID": 558,
                        "Code": "13",
                        "Name": "Granada"
                    },
                    {
                        "ID": 559,
                        "Code": "15",
                        "Name": "Guadalupe"
                    },
                    {
                        "ID": 560,
                        "Code": "15",
                        "Name": "Rionegro"
                    },
                    {
                        "ID": 561,
                        "Code": "18",
                        "Name": "Guarne"
                    },
                    {
                        "ID": 562,
                        "Code": "19",
                        "Name": "Toledo"
                    },
                    {
                        "ID": 563,
                        "Code": "20",
                        "Name": "Cáceres"
                    },
                    {
                        "ID": 564,
                        "Code": "21",
                        "Name": "Alejandría"
                    },
                    {
                        "ID": 565,
                        "Code": "21",
                        "Name": "Guatapé"
                    },
                    {
                        "ID": 566,
                        "Code": "25",
                        "Name": "Caicedo"
                    },
                    {
                        "ID": 567,
                        "Code": "25",
                        "Name": "Maceo"
                    },
                    {
                        "ID": 568,
                        "Code": "28",
                        "Name": "Sabanalarga"
                    },
                    {
                        "ID": 569,
                        "Code": "29",
                        "Name": "Caldas"
                    },
                    {
                        "ID": 570,
                        "Code": "30",
                        "Name": "Amagá"
                    },
                    {
                        "ID": 571,
                        "Code": "31",
                        "Name": "Amalfi"
                    },
                    {
                        "ID": 572,
                        "Code": "31",
                        "Name": "Sabaneta"
                    },
                    {
                        "ID": 573,
                        "Code": "34",
                        "Name": "Andes"
                    },
                    {
                        "ID": 574,
                        "Code": "34",
                        "Name": "Campamento"
                    },
                    {
                        "ID": 575,
                        "Code": "34",
                        "Name": "Dabeiba"
                    },
                    {
                        "ID": 576,
                        "Code": "36",
                        "Name": "Angelópolis"
                    },
                    {
                        "ID": 577,
                        "Code": "36",
                        "Name": "Segovia"
                    },
                    {
                        "ID": 578,
                        "Code": "37",
                        "Name": "Don Matías"
                    },
                    {
                        "ID": 579,
                        "Code": "37",
                        "Name": "Turbo"
                    },
                    {
                        "ID": 580,
                        "Code": "38",
                        "Name": "Angostura"
                    },
                    {
                        "ID": 581,
                        "Code": "38",
                        "Name": "Cañasgordas"
                    },
                    {
                        "ID": 582,
                        "Code": "40",
                        "Name": "Anorí"
                    },
                    {
                        "ID": 583,
                        "Code": "40",
                        "Name": "Ebéjico"
                    },
                    {
                        "ID": 584,
                        "Code": "40",
                        "Name": "Marinilla"
                    },
                    {
                        "ID": 585,
                        "Code": "41",
                        "Name": "Peñol"
                    },
                    {
                        "ID": 586,
                        "Code": "42",
                        "Name": "Caracolí"
                    },
                    {
                        "ID": 587,
                        "Code": "42",
                        "Name": "Salgar"
                    },
                    {
                        "ID": 588,
                        "Code": "42",
                        "Name": "Santafé de Antioquia"
                    },
                    {
                        "ID": 589,
                        "Code": "42",
                        "Name": "Uramita"
                    },
                    {
                        "ID": 590,
                        "Code": "43",
                        "Name": "Peque"
                    },
                    {
                        "ID": 591,
                        "Code": "44",
                        "Name": "Anza"
                    },
                    {
                        "ID": 592,
                        "Code": "45",
                        "Name": "Apartadó"
                    },
                    {
                        "ID": 593,
                        "Code": "45",
                        "Name": "Caramanta"
                    },
                    {
                        "ID": 594,
                        "Code": "47",
                        "Name": "Carepa"
                    },
                    {
                        "ID": 595,
                        "Code": "47",
                        "Name": "Heliconia"
                    },
                    {
                        "ID": 596,
                        "Code": "47",
                        "Name": "San Andrés de Cuerquía"
                    },
                    {
                        "ID": 597,
                        "Code": "47",
                        "Name": "Urrao"
                    },
                    {
                        "ID": 598,
                        "Code": "48",
                        "Name": "El Carmen de Viboral"
                    },
                    {
                        "ID": 599,
                        "Code": "49",
                        "Name": "San Carlos"
                    },
                    {
                        "ID": 600,
                        "Code": "50",
                        "Name": "Carolina"
                    },
                    {
                        "ID": 601,
                        "Code": "50",
                        "Name": "El Bagre"
                    },
                    {
                        "ID": 602,
                        "Code": "51",
                        "Name": "Arboletes"
                    },
                    {
                        "ID": 603,
                        "Code": "52",
                        "Name": "San Francisco"
                    },
                    {
                        "ID": 604,
                        "Code": "53",
                        "Name": "Hispania"
                    },
                    {
                        "ID": 605,
                        "Code": "54",
                        "Name": "Caucasia"
                    },
                    {
                        "ID": 606,
                        "Code": "54",
                        "Name": "Valdivia"
                    },
                    {
                        "ID": 607,
                        "Code": "55",
                        "Name": "Argelia"
                    },
                    {
                        "ID": 608,
                        "Code": "56",
                        "Name": "San Jerónimo"
                    },
                    {
                        "ID": 609,
                        "Code": "56",
                        "Name": "Sonsón"
                    },
                    {
                        "ID": 610,
                        "Code": "56",
                        "Name": "Valparaíso"
                    },
                    {
                        "ID": 611,
                        "Code": "58",
                        "Name": "San José de La Montaña"
                    },
                    {
                        "ID": 612,
                        "Code": "58",
                        "Name": "Vegachí"
                    },
                    {
                        "ID": 613,
                        "Code": "59",
                        "Name": "Armenia"
                    },
                    {
                        "ID": 614,
                        "Code": "59",
                        "Name": "San Juan de Urabá"
                    },
                    {
                        "ID": 615,
                        "Code": "60",
                        "Name": "Itagui"
                    },
                    {
                        "ID": 616,
                        "Code": "60",
                        "Name": "San Luis"
                    },
                    {
                        "ID": 617,
                        "Code": "61",
                        "Name": "Ituango"
                    },
                    {
                        "ID": 618,
                        "Code": "61",
                        "Name": "Sopetrán"
                    },
                    {
                        "ID": 619,
                        "Code": "61",
                        "Name": "Venecia"
                    },
                    {
                        "ID": 620,
                        "Code": "64",
                        "Name": "Entrerrios"
                    },
                    {
                        "ID": 621,
                        "Code": "64",
                        "Name": "Jardín"
                    },
                    {
                        "ID": 622,
                        "Code": "64",
                        "Name": "San Pedro"
                    },
                    {
                        "ID": 623,
                        "Code": "65",
                        "Name": "San Pedro de Uraba"
                    },
                    {
                        "ID": 624,
                        "Code": "66",
                        "Name": "Envigado"
                    },
                    {
                        "ID": 625,
                        "Code": "67",
                        "Name": "Montebello"
                    },
                    {
                        "ID": 626,
                        "Code": "67",
                        "Name": "San Rafael"
                    },
                    {
                        "ID": 627,
                        "Code": "68",
                        "Name": "Jericó"
                    },
                    {
                        "ID": 628,
                        "Code": "70",
                        "Name": "San Roque"
                    },
                    {
                        "ID": 629,
                        "Code": "72",
                        "Name": "Chigorodó"
                    },
                    {
                        "ID": 630,
                        "Code": "73",
                        "Name": "Vigía del Fuerte"
                    },
                    {
                        "ID": 631,
                        "Code": "74",
                        "Name": "San Vicente"
                    },
                    {
                        "ID": 632,
                        "Code": "75",
                        "Name": "Murindó"
                    },
                    {
                        "ID": 633,
                        "Code": "76",
                        "Name": "La Ceja"
                    },
                    {
                        "ID": 634,
                        "Code": "76",
                        "Name": "Pueblorrico"
                    },
                    {
                        "ID": 635,
                        "Code": "79",
                        "Name": "Barbosa"
                    },
                    {
                        "ID": 636,
                        "Code": "79",
                        "Name": "Puerto Berrío"
                    },
                    {
                        "ID": 637,
                        "Code": "79",
                        "Name": "Santa Bárbara"
                    },
                    {
                        "ID": 638,
                        "Code": "80",
                        "Name": "La Estrella"
                    },
                    {
                        "ID": 639,
                        "Code": "80",
                        "Name": "Mutatá"
                    },
                    {
                        "ID": 640,
                        "Code": "82",
                        "Name": "Fredonia"
                    },
                    {
                        "ID": 641,
                        "Code": "83",
                        "Name": "Nariño"
                    },
                    {
                        "ID": 642,
                        "Code": "84",
                        "Name": "Frontino"
                    },
                    {
                        "ID": 643,
                        "Code": "85",
                        "Name": "Puerto Nare"
                    },
                    {
                        "ID": 644,
                        "Code": "85",
                        "Name": "Yalí"
                    },
                    {
                        "ID": 645,
                        "Code": "86",
                        "Name": "Belmira"
                    },
                    {
                        "ID": 646,
                        "Code": "86",
                        "Name": "Santa Rosa de Osos"
                    },
                    {
                        "ID": 647,
                        "Code": "87",
                        "Name": "Yarumal"
                    },
                    {
                        "ID": 648,
                        "Code": "88",
                        "Name": "Bello"
                    },
                    {
                        "ID": 649,
                        "Code": "89",
                        "Name": "Támesis"
                    },
                    {
                        "ID": 650,
                        "Code": "90",
                        "Name": "Cisneros"
                    },
                    {
                        "ID": 651,
                        "Code": "90",
                        "Name": "La Pintada"
                    },
                    {
                        "ID": 652,
                        "Code": "90",
                        "Name": "Necoclí"
                    },
                    {
                        "ID": 653,
                        "Code": "90",
                        "Name": "Santo Domingo"
                    },
                    {
                        "ID": 654,
                        "Code": "90",
                        "Name": "Tarazá"
                    },
                    {
                        "ID": 655,
                        "Code": "90",
                        "Name": "Yolombó"
                    },
                    {
                        "ID": 656,
                        "Code": "91",
                        "Name": "Betania"
                    },
                    {
                        "ID": 657,
                        "Code": "91",
                        "Name": "Puerto Triunfo"
                    },
                    {
                        "ID": 658,
                        "Code": "92",
                        "Name": "Tarso"
                    },
                    {
                        "ID": 659,
                        "Code": "93",
                        "Name": "Betulia"
                    },
                    {
                        "ID": 660,
                        "Code": "93",
                        "Name": "Yondó"
                    },
                    {
                        "ID": 661,
                        "Code": "95",
                        "Name": "Nechí"
                    },
                    {
                        "ID": 662,
                        "Code": "95",
                        "Name": "Zaragoza"
                    },
                    {
                        "ID": 663,
                        "Code": "97",
                        "Name": "Cocorná"
                    },
                    {
                        "ID": 664,
                        "Code": "97",
                        "Name": "El Santuario"
                    }
                ];
            }
            else if (id == 15) {
                this.ciudades = [
                    {
                        "ID": 665,
                        "Code": "001",
                        "Name": "Villavicencio"
                    },
                    {
                        "ID": 666,
                        "Code": "006",
                        "Name": "Acacias"
                    },
                    {
                        "ID": 667,
                        "Code": "110",
                        "Name": "Barranca de Upía"
                    },
                    {
                        "ID": 668,
                        "Code": "124",
                        "Name": "Cabuyaro"
                    },
                    {
                        "ID": 669,
                        "Code": "150",
                        "Name": "Castilla la Nueva"
                    },
                    {
                        "ID": 670,
                        "Code": "223",
                        "Name": "Cubarral"
                    },
                    {
                        "ID": 671,
                        "Code": "226",
                        "Name": "Cumaral"
                    },
                    {
                        "ID": 672,
                        "Code": "245",
                        "Name": "El Calvario"
                    },
                    {
                        "ID": 673,
                        "Code": "251",
                        "Name": "El Castillo"
                    },
                    {
                        "ID": 674,
                        "Code": "270",
                        "Name": "El Dorado"
                    },
                    {
                        "ID": 675,
                        "Code": "287",
                        "Name": "Fuente de Oro"
                    },
                    {
                        "ID": 676,
                        "Code": "313",
                        "Name": "Granada"
                    },
                    {
                        "ID": 677,
                        "Code": "318",
                        "Name": "Guamal"
                    },
                    {
                        "ID": 678,
                        "Code": "325",
                        "Name": "Mapiripán"
                    },
                    {
                        "ID": 679,
                        "Code": "330",
                        "Name": "Mesetas"
                    },
                    {
                        "ID": 680,
                        "Code": "350",
                        "Name": "La Macarena"
                    },
                    {
                        "ID": 681,
                        "Code": "370",
                        "Name": "Uribe"
                    },
                    {
                        "ID": 682,
                        "Code": "400",
                        "Name": "Lejanías"
                    },
                    {
                        "ID": 683,
                        "Code": "450",
                        "Name": "Puerto Concordia"
                    },
                    {
                        "ID": 684,
                        "Code": "568",
                        "Name": "Puerto Gaitán"
                    },
                    {
                        "ID": 685,
                        "Code": "573",
                        "Name": "Puerto López"
                    },
                    {
                        "ID": 686,
                        "Code": "577",
                        "Name": "Puerto Lleras"
                    },
                    {
                        "ID": 687,
                        "Code": "590",
                        "Name": "Puerto Rico"
                    },
                    {
                        "ID": 688,
                        "Code": "606",
                        "Name": "Restrepo"
                    },
                    {
                        "ID": 689,
                        "Code": "680",
                        "Name": "San Carlos de Guaroa"
                    },
                    {
                        "ID": 690,
                        "Code": "683",
                        "Name": "San Juan de Arama"
                    },
                    {
                        "ID": 691,
                        "Code": "686",
                        "Name": "San Juanito"
                    },
                    {
                        "ID": 692,
                        "Code": "689",
                        "Name": "San Martín"
                    },
                    {
                        "ID": 693,
                        "Code": "811",
                        "Name": "Vista Hermosa"
                    }
                ];
            }
            else if (id == 16) {
                this.ciudades = [
                    {
                        "ID": 694,
                        "Code": "001",
                        "Name": "Pasto"
                    },
                    {
                        "ID": 695,
                        "Code": "019",
                        "Name": "Albán"
                    },
                    {
                        "ID": 696,
                        "Code": "022",
                        "Name": "Aldana"
                    },
                    {
                        "ID": 697,
                        "Code": "036",
                        "Name": "Ancuyá"
                    },
                    {
                        "ID": 698,
                        "Code": "051",
                        "Name": "Arboleda"
                    },
                    {
                        "ID": 699,
                        "Code": "079",
                        "Name": "Barbacoas"
                    },
                    {
                        "ID": 700,
                        "Code": "083",
                        "Name": "Belén"
                    },
                    {
                        "ID": 701,
                        "Code": "110",
                        "Name": "Buesaco"
                    },
                    {
                        "ID": 702,
                        "Code": "203",
                        "Name": "Colón"
                    },
                    {
                        "ID": 703,
                        "Code": "207",
                        "Name": "Consaca"
                    },
                    {
                        "ID": 704,
                        "Code": "210",
                        "Name": "Contadero"
                    },
                    {
                        "ID": 705,
                        "Code": "215",
                        "Name": "Córdoba"
                    },
                    {
                        "ID": 706,
                        "Code": "224",
                        "Name": "Cuaspud"
                    },
                    {
                        "ID": 707,
                        "Code": "227",
                        "Name": "Cumbal"
                    },
                    {
                        "ID": 708,
                        "Code": "233",
                        "Name": "Cumbitara"
                    },
                    {
                        "ID": 709,
                        "Code": "240",
                        "Name": "Chachagüí"
                    },
                    {
                        "ID": 710,
                        "Code": "250",
                        "Name": "El Charco"
                    },
                    {
                        "ID": 711,
                        "Code": "254",
                        "Name": "El Peñol"
                    },
                    {
                        "ID": 712,
                        "Code": "256",
                        "Name": "El Rosario"
                    },
                    {
                        "ID": 713,
                        "Code": "258",
                        "Name": "El Tablón de Gómez"
                    },
                    {
                        "ID": 714,
                        "Code": "260",
                        "Name": "El Tambo"
                    },
                    {
                        "ID": 715,
                        "Code": "287",
                        "Name": "Funes"
                    },
                    {
                        "ID": 716,
                        "Code": "317",
                        "Name": "Guachucal"
                    },
                    {
                        "ID": 717,
                        "Code": "320",
                        "Name": "Guaitarilla"
                    },
                    {
                        "ID": 718,
                        "Code": "323",
                        "Name": "Gualmatán"
                    },
                    {
                        "ID": 719,
                        "Code": "352",
                        "Name": "Iles"
                    },
                    {
                        "ID": 720,
                        "Code": "354",
                        "Name": "Imués"
                    },
                    {
                        "ID": 721,
                        "Code": "356",
                        "Name": "Ipiales"
                    },
                    {
                        "ID": 722,
                        "Code": "378",
                        "Name": "La Cruz"
                    },
                    {
                        "ID": 723,
                        "Code": "381",
                        "Name": "La Florida"
                    },
                    {
                        "ID": 724,
                        "Code": "385",
                        "Name": "La Llanada"
                    },
                    {
                        "ID": 725,
                        "Code": "390",
                        "Name": "La Tola"
                    },
                    {
                        "ID": 726,
                        "Code": "399",
                        "Name": "La Unión"
                    },
                    {
                        "ID": 727,
                        "Code": "405",
                        "Name": "Leiva"
                    },
                    {
                        "ID": 728,
                        "Code": "411",
                        "Name": "Linares"
                    },
                    {
                        "ID": 729,
                        "Code": "418",
                        "Name": "Los Andes"
                    },
                    {
                        "ID": 730,
                        "Code": "427",
                        "Name": "Magüí"
                    },
                    {
                        "ID": 731,
                        "Code": "435",
                        "Name": "Mallama"
                    },
                    {
                        "ID": 732,
                        "Code": "473",
                        "Name": "Mosquera"
                    },
                    {
                        "ID": 733,
                        "Code": "480",
                        "Name": "Nariño"
                    },
                    {
                        "ID": 734,
                        "Code": "490",
                        "Name": "Olaya Herrera"
                    },
                    {
                        "ID": 735,
                        "Code": "506",
                        "Name": "Ospina"
                    },
                    {
                        "ID": 736,
                        "Code": "520",
                        "Name": "Francisco Pizarro"
                    },
                    {
                        "ID": 737,
                        "Code": "540",
                        "Name": "Policarpa"
                    },
                    {
                        "ID": 738,
                        "Code": "560",
                        "Name": "Potosí"
                    },
                    {
                        "ID": 739,
                        "Code": "565",
                        "Name": "Providencia"
                    },
                    {
                        "ID": 740,
                        "Code": "573",
                        "Name": "Puerres"
                    },
                    {
                        "ID": 741,
                        "Code": "585",
                        "Name": "Pupiales"
                    },
                    {
                        "ID": 742,
                        "Code": "612",
                        "Name": "Ricaurte"
                    },
                    {
                        "ID": 743,
                        "Code": "621",
                        "Name": "Roberto Payán"
                    },
                    {
                        "ID": 744,
                        "Code": "678",
                        "Name": "Samaniego"
                    },
                    {
                        "ID": 745,
                        "Code": "683",
                        "Name": "Sandoná"
                    },
                    {
                        "ID": 746,
                        "Code": "685",
                        "Name": "San Bernardo"
                    },
                    {
                        "ID": 747,
                        "Code": "687",
                        "Name": "San Lorenzo"
                    },
                    {
                        "ID": 748,
                        "Code": "693",
                        "Name": "San Pablo"
                    },
                    {
                        "ID": 749,
                        "Code": "694",
                        "Name": "San Pedro de Cartago"
                    },
                    {
                        "ID": 750,
                        "Code": "696",
                        "Name": "Santa Bárbara"
                    },
                    {
                        "ID": 751,
                        "Code": "699",
                        "Name": "Santacruz"
                    },
                    {
                        "ID": 752,
                        "Code": "720",
                        "Name": "Sapuyes"
                    },
                    {
                        "ID": 753,
                        "Code": "786",
                        "Name": "Taminango"
                    },
                    {
                        "ID": 754,
                        "Code": "788",
                        "Name": "Tangua"
                    },
                    {
                        "ID": 755,
                        "Code": "835",
                        "Name": "San Andrés de Tumaco"
                    },
                    {
                        "ID": 756,
                        "Code": "838",
                        "Name": "Túquerres"
                    },
                    {
                        "ID": 757,
                        "Code": "885",
                        "Name": "Yacuanquer"
                    }
                ];
            }
            else if (id == 17) {
                this.ciudades = [
                    {
                        "ID": 758,
                        "Code": "001",
                        "Name": "Cúcuta"
                    },
                    {
                        "ID": 759,
                        "Code": "003",
                        "Name": "Abrego"
                    },
                    {
                        "ID": 760,
                        "Code": "051",
                        "Name": "Arboledas"
                    },
                    {
                        "ID": 761,
                        "Code": "099",
                        "Name": "Bochalema"
                    },
                    {
                        "ID": 762,
                        "Code": "109",
                        "Name": "Bucarasica"
                    },
                    {
                        "ID": 763,
                        "Code": "125",
                        "Name": "Cácota"
                    },
                    {
                        "ID": 764,
                        "Code": "128",
                        "Name": "Cachirá"
                    },
                    {
                        "ID": 765,
                        "Code": "172",
                        "Name": "Chinácota"
                    },
                    {
                        "ID": 766,
                        "Code": "174",
                        "Name": "Chitagá"
                    },
                    {
                        "ID": 767,
                        "Code": "206",
                        "Name": "Convención"
                    },
                    {
                        "ID": 768,
                        "Code": "223",
                        "Name": "Cucutilla"
                    },
                    {
                        "ID": 769,
                        "Code": "239",
                        "Name": "Durania"
                    },
                    {
                        "ID": 770,
                        "Code": "245",
                        "Name": "El Carmen"
                    },
                    {
                        "ID": 771,
                        "Code": "250",
                        "Name": "El Tarra"
                    },
                    {
                        "ID": 772,
                        "Code": "261",
                        "Name": "El Zulia"
                    },
                    {
                        "ID": 773,
                        "Code": "313",
                        "Name": "Gramalote"
                    },
                    {
                        "ID": 774,
                        "Code": "344",
                        "Name": "Hacarí"
                    },
                    {
                        "ID": 775,
                        "Code": "347",
                        "Name": "Herrán"
                    },
                    {
                        "ID": 776,
                        "Code": "377",
                        "Name": "Labateca"
                    },
                    {
                        "ID": 777,
                        "Code": "385",
                        "Name": "La Esperanza"
                    },
                    {
                        "ID": 778,
                        "Code": "398",
                        "Name": "La Playa"
                    },
                    {
                        "ID": 779,
                        "Code": "405",
                        "Name": "Los Patios"
                    },
                    {
                        "ID": 780,
                        "Code": "418",
                        "Name": "Lourdes"
                    },
                    {
                        "ID": 781,
                        "Code": "480",
                        "Name": "Mutiscua"
                    },
                    {
                        "ID": 782,
                        "Code": "498",
                        "Name": "Ocaña"
                    },
                    {
                        "ID": 783,
                        "Code": "518",
                        "Name": "Pamplona"
                    },
                    {
                        "ID": 784,
                        "Code": "520",
                        "Name": "Pamplonita"
                    },
                    {
                        "ID": 785,
                        "Code": "553",
                        "Name": "Puerto Santander"
                    },
                    {
                        "ID": 786,
                        "Code": "599",
                        "Name": "Ragonvalia"
                    },
                    {
                        "ID": 787,
                        "Code": "660",
                        "Name": "Salazar"
                    },
                    {
                        "ID": 788,
                        "Code": "670",
                        "Name": "San Calixto"
                    },
                    {
                        "ID": 789,
                        "Code": "673",
                        "Name": "San Cayetano"
                    },
                    {
                        "ID": 790,
                        "Code": "680",
                        "Name": "Santiago"
                    },
                    {
                        "ID": 791,
                        "Code": "720",
                        "Name": "Sardinata"
                    },
                    {
                        "ID": 792,
                        "Code": "743",
                        "Name": "Silos"
                    },
                    {
                        "ID": 793,
                        "Code": "800",
                        "Name": "Teorama"
                    },
                    {
                        "ID": 794,
                        "Code": "810",
                        "Name": "Tibú"
                    },
                    {
                        "ID": 795,
                        "Code": "820",
                        "Name": "Toledo"
                    },
                    {
                        "ID": 796,
                        "Code": "871",
                        "Name": "Villa Caro"
                    },
                    {
                        "ID": 797,
                        "Code": "874",
                        "Name": "Villa del Rosario"
                    }
                ];
            }
            else if (id == 18) {
                this.ciudades = [
                    {
                        "ID": 798,
                        "Code": "001",
                        "Name": "Armenia"
                    },
                    {
                        "ID": 799,
                        "Code": "111",
                        "Name": "Buenavista"
                    },
                    {
                        "ID": 800,
                        "Code": "130",
                        "Name": "Calarcá"
                    },
                    {
                        "ID": 801,
                        "Code": "190",
                        "Name": "Circasia"
                    },
                    {
                        "ID": 802,
                        "Code": "212",
                        "Name": "Córdoba"
                    },
                    {
                        "ID": 803,
                        "Code": "272",
                        "Name": "Filandia"
                    },
                    {
                        "ID": 804,
                        "Code": "302",
                        "Name": "Génova"
                    },
                    {
                        "ID": 805,
                        "Code": "401",
                        "Name": "La Tebaida"
                    },
                    {
                        "ID": 806,
                        "Code": "470",
                        "Name": "Montenegro"
                    },
                    {
                        "ID": 807,
                        "Code": "548",
                        "Name": "Pijao"
                    },
                    {
                        "ID": 808,
                        "Code": "594",
                        "Name": "Quimbaya"
                    },
                    {
                        "ID": 809,
                        "Code": "690",
                        "Name": "Salento"
                    }
                ];
            }
            else if (id == 19) {
                this.ciudades = [
                    {
                        "ID": 810,
                        "Code": "001",
                        "Name": "Pereira"
                    },
                    {
                        "ID": 811,
                        "Code": "045",
                        "Name": "Apía"
                    },
                    {
                        "ID": 812,
                        "Code": "075",
                        "Name": "Balboa"
                    },
                    {
                        "ID": 813,
                        "Code": "088",
                        "Name": "Belén de Umbría"
                    },
                    {
                        "ID": 814,
                        "Code": "170",
                        "Name": "Dosquebradas"
                    },
                    {
                        "ID": 815,
                        "Code": "318",
                        "Name": "Guática"
                    },
                    {
                        "ID": 816,
                        "Code": "383",
                        "Name": "La Celia"
                    },
                    {
                        "ID": 817,
                        "Code": "400",
                        "Name": "La Virginia"
                    },
                    {
                        "ID": 818,
                        "Code": "440",
                        "Name": "Marsella"
                    },
                    {
                        "ID": 819,
                        "Code": "456",
                        "Name": "Mistrató"
                    },
                    {
                        "ID": 820,
                        "Code": "572",
                        "Name": "Pueblo Rico"
                    },
                    {
                        "ID": 821,
                        "Code": "594",
                        "Name": "Quinchía"
                    },
                    {
                        "ID": 822,
                        "Code": "682",
                        "Name": "Santa Rosa de Cabal"
                    },
                    {
                        "ID": 823,
                        "Code": "687",
                        "Name": "Santuario"
                    }
                ];
            }
            else if (id == 20) {
                this.ciudades = [
                    {
                        "ID": 824,
                        "Code": "001",
                        "Name": "Bucaramanga"
                    },
                    {
                        "ID": 825,
                        "Code": "013",
                        "Name": "Aguada"
                    },
                    {
                        "ID": 826,
                        "Code": "020",
                        "Name": "Albania"
                    },
                    {
                        "ID": 827,
                        "Code": "051",
                        "Name": "Aratoca"
                    },
                    {
                        "ID": 828,
                        "Code": "077",
                        "Name": "Barbosa"
                    },
                    {
                        "ID": 829,
                        "Code": "079",
                        "Name": "Barichara"
                    },
                    {
                        "ID": 830,
                        "Code": "081",
                        "Name": "Barrancabermeja"
                    },
                    {
                        "ID": 831,
                        "Code": "092",
                        "Name": "Betulia"
                    },
                    {
                        "ID": 832,
                        "Code": "101",
                        "Name": "Bolívar"
                    },
                    {
                        "ID": 833,
                        "Code": "121",
                        "Name": "Cabrera"
                    },
                    {
                        "ID": 834,
                        "Code": "132",
                        "Name": "California"
                    },
                    {
                        "ID": 835,
                        "Code": "147",
                        "Name": "Capitanejo"
                    },
                    {
                        "ID": 836,
                        "Code": "152",
                        "Name": "Carcasí"
                    },
                    {
                        "ID": 837,
                        "Code": "160",
                        "Name": "Cepitá"
                    },
                    {
                        "ID": 838,
                        "Code": "162",
                        "Name": "Cerrito"
                    },
                    {
                        "ID": 839,
                        "Code": "167",
                        "Name": "Charalá"
                    },
                    {
                        "ID": 840,
                        "Code": "169",
                        "Name": "Charta"
                    },
                    {
                        "ID": 841,
                        "Code": "176",
                        "Name": "Chimá"
                    },
                    {
                        "ID": 842,
                        "Code": "179",
                        "Name": "Chipatá"
                    },
                    {
                        "ID": 843,
                        "Code": "190",
                        "Name": "Cimitarra"
                    },
                    {
                        "ID": 844,
                        "Code": "207",
                        "Name": "Concepción"
                    },
                    {
                        "ID": 845,
                        "Code": "209",
                        "Name": "Confines"
                    },
                    {
                        "ID": 846,
                        "Code": "211",
                        "Name": "Contratación"
                    },
                    {
                        "ID": 847,
                        "Code": "217",
                        "Name": "Coromoro"
                    },
                    {
                        "ID": 848,
                        "Code": "229",
                        "Name": "Curití"
                    },
                    {
                        "ID": 849,
                        "Code": "235",
                        "Name": "El Carmen de Chucurí"
                    },
                    {
                        "ID": 850,
                        "Code": "245",
                        "Name": "El Guacamayo"
                    },
                    {
                        "ID": 851,
                        "Code": "250",
                        "Name": "El Peñón"
                    },
                    {
                        "ID": 852,
                        "Code": "255",
                        "Name": "El Playón"
                    },
                    {
                        "ID": 853,
                        "Code": "264",
                        "Name": "Encino"
                    },
                    {
                        "ID": 854,
                        "Code": "266",
                        "Name": "Enciso"
                    },
                    {
                        "ID": 855,
                        "Code": "271",
                        "Name": "Florián"
                    },
                    {
                        "ID": 856,
                        "Code": "276",
                        "Name": "Floridablanca"
                    },
                    {
                        "ID": 857,
                        "Code": "296",
                        "Name": "Galán"
                    },
                    {
                        "ID": 858,
                        "Code": "298",
                        "Name": "Gambita"
                    },
                    {
                        "ID": 859,
                        "Code": "307",
                        "Name": "Girón"
                    },
                    {
                        "ID": 860,
                        "Code": "318",
                        "Name": "Guaca"
                    },
                    {
                        "ID": 861,
                        "Code": "320",
                        "Name": "Guadalupe"
                    },
                    {
                        "ID": 862,
                        "Code": "322",
                        "Name": "Guapotá"
                    },
                    {
                        "ID": 863,
                        "Code": "324",
                        "Name": "Guavatá"
                    },
                    {
                        "ID": 864,
                        "Code": "327",
                        "Name": "Güepsa"
                    },
                    {
                        "ID": 865,
                        "Code": "344",
                        "Name": "Hato"
                    },
                    {
                        "ID": 866,
                        "Code": "368",
                        "Name": "Jesús María"
                    },
                    {
                        "ID": 867,
                        "Code": "370",
                        "Name": "Jordán"
                    },
                    {
                        "ID": 868,
                        "Code": "377",
                        "Name": "La Belleza"
                    },
                    {
                        "ID": 869,
                        "Code": "385",
                        "Name": "Landázuri"
                    },
                    {
                        "ID": 870,
                        "Code": "397",
                        "Name": "La Paz"
                    },
                    {
                        "ID": 871,
                        "Code": "406",
                        "Name": "Lebríja"
                    },
                    {
                        "ID": 872,
                        "Code": "418",
                        "Name": "Los Santos"
                    },
                    {
                        "ID": 873,
                        "Code": "425",
                        "Name": "Macaravita"
                    },
                    {
                        "ID": 874,
                        "Code": "432",
                        "Name": "Málaga"
                    },
                    {
                        "ID": 875,
                        "Code": "444",
                        "Name": "Matanza"
                    },
                    {
                        "ID": 876,
                        "Code": "464",
                        "Name": "Mogotes"
                    },
                    {
                        "ID": 877,
                        "Code": "468",
                        "Name": "Molagavita"
                    },
                    {
                        "ID": 878,
                        "Code": "498",
                        "Name": "Ocamonte"
                    },
                    {
                        "ID": 879,
                        "Code": "500",
                        "Name": "Oiba"
                    },
                    {
                        "ID": 880,
                        "Code": "502",
                        "Name": "Onzaga"
                    },
                    {
                        "ID": 881,
                        "Code": "522",
                        "Name": "Palmar"
                    },
                    {
                        "ID": 882,
                        "Code": "524",
                        "Name": "Palmas del Socorro"
                    },
                    {
                        "ID": 883,
                        "Code": "533",
                        "Name": "Páramo"
                    },
                    {
                        "ID": 884,
                        "Code": "547",
                        "Name": "Piedecuesta"
                    },
                    {
                        "ID": 885,
                        "Code": "549",
                        "Name": "Pinchote"
                    },
                    {
                        "ID": 886,
                        "Code": "572",
                        "Name": "Puente Nacional"
                    },
                    {
                        "ID": 887,
                        "Code": "573",
                        "Name": "Puerto Parra"
                    },
                    {
                        "ID": 888,
                        "Code": "575",
                        "Name": "Puerto Wilches"
                    },
                    {
                        "ID": 889,
                        "Code": "615",
                        "Name": "Rionegro"
                    },
                    {
                        "ID": 890,
                        "Code": "655",
                        "Name": "Sabana de Torres"
                    },
                    {
                        "ID": 891,
                        "Code": "669",
                        "Name": "San Andrés"
                    },
                    {
                        "ID": 892,
                        "Code": "673",
                        "Name": "San Benito"
                    },
                    {
                        "ID": 893,
                        "Code": "679",
                        "Name": "San Gil"
                    },
                    {
                        "ID": 894,
                        "Code": "682",
                        "Name": "San Joaquín"
                    },
                    {
                        "ID": 895,
                        "Code": "684",
                        "Name": "San José de Miranda"
                    },
                    {
                        "ID": 896,
                        "Code": "686",
                        "Name": "San Miguel"
                    },
                    {
                        "ID": 897,
                        "Code": "689",
                        "Name": "San Vicente de Chucurí"
                    },
                    {
                        "ID": 898,
                        "Code": "705",
                        "Name": "Santa Bárbara"
                    },
                    {
                        "ID": 899,
                        "Code": "720",
                        "Name": "Santa Helena del Opón"
                    },
                    {
                        "ID": 900,
                        "Code": "745",
                        "Name": "Simacota"
                    },
                    {
                        "ID": 901,
                        "Code": "755",
                        "Name": "Socorro"
                    },
                    {
                        "ID": 902,
                        "Code": "770",
                        "Name": "Suaita"
                    },
                    {
                        "ID": 903,
                        "Code": "773",
                        "Name": "Sucre"
                    },
                    {
                        "ID": 904,
                        "Code": "780",
                        "Name": "Suratá"
                    },
                    {
                        "ID": 905,
                        "Code": "820",
                        "Name": "Tona"
                    },
                    {
                        "ID": 906,
                        "Code": "855",
                        "Name": "Valle de San José"
                    },
                    {
                        "ID": 907,
                        "Code": "861",
                        "Name": "Vélez"
                    },
                    {
                        "ID": 908,
                        "Code": "867",
                        "Name": "Vetas"
                    },
                    {
                        "ID": 909,
                        "Code": "872",
                        "Name": "Villanueva"
                    },
                    {
                        "ID": 910,
                        "Code": "895",
                        "Name": "Zapatoca"
                    }
                ];
            }
            else if (id == 21) {
                this.ciudades = [
                    {
                        "ID": 911,
                        "Code": "001",
                        "Name": "Sincelejo"
                    },
                    {
                        "ID": 912,
                        "Code": "110",
                        "Name": "Buenavista"
                    },
                    {
                        "ID": 913,
                        "Code": "124",
                        "Name": "Caimito"
                    },
                    {
                        "ID": 914,
                        "Code": "204",
                        "Name": "Coloso"
                    },
                    {
                        "ID": 915,
                        "Code": "215",
                        "Name": "Corozal"
                    },
                    {
                        "ID": 916,
                        "Code": "221",
                        "Name": "Coveñas"
                    },
                    {
                        "ID": 917,
                        "Code": "230",
                        "Name": "Chalán"
                    },
                    {
                        "ID": 918,
                        "Code": "233",
                        "Name": "El Roble"
                    },
                    {
                        "ID": 919,
                        "Code": "235",
                        "Name": "Galeras"
                    },
                    {
                        "ID": 920,
                        "Code": "265",
                        "Name": "Guaranda"
                    },
                    {
                        "ID": 921,
                        "Code": "400",
                        "Name": "La Unión"
                    },
                    {
                        "ID": 922,
                        "Code": "418",
                        "Name": "Los Palmitos"
                    },
                    {
                        "ID": 923,
                        "Code": "429",
                        "Name": "Majagual"
                    },
                    {
                        "ID": 924,
                        "Code": "473",
                        "Name": "Morroa"
                    },
                    {
                        "ID": 925,
                        "Code": "508",
                        "Name": "Ovejas"
                    },
                    {
                        "ID": 926,
                        "Code": "523",
                        "Name": "Palmito"
                    },
                    {
                        "ID": 927,
                        "Code": "670",
                        "Name": "Sampués"
                    },
                    {
                        "ID": 928,
                        "Code": "678",
                        "Name": "San Benito Abad"
                    },
                    {
                        "ID": 929,
                        "Code": "802",
                        "Name": "San Juan de Betulia"
                    },
                    {
                        "ID": 930,
                        "Code": "808",
                        "Name": "San Marcos"
                    },
                    {
                        "ID": 931,
                        "Code": "813",
                        "Name": "San Onofre"
                    },
                    {
                        "ID": 932,
                        "Code": "817",
                        "Name": "San Pedro"
                    },
                    {
                        "ID": 933,
                        "Code": "820",
                        "Name": "Santiago de Tolú"
                    },
                    {
                        "ID": 934,
                        "Code": "823",
                        "Name": "Tolú Viejo"
                    },
                    {
                        "ID": 935,
                        "Code": "842",
                        "Name": "San Luis de Sincé"
                    },
                    {
                        "ID": 936,
                        "Code": "871",
                        "Name": "Sucre"
                    }
                ];
            }
            else if (id == 22) {
                this.ciudades = [
                    {
                        "ID": 937,
                        "Code": "001",
                        "Name": "Ibagué"
                    },
                    {
                        "ID": 938,
                        "Code": "024",
                        "Name": "Alpujarra"
                    },
                    {
                        "ID": 939,
                        "Code": "026",
                        "Name": "Alvarado"
                    },
                    {
                        "ID": 940,
                        "Code": "030",
                        "Name": "Ambalema"
                    },
                    {
                        "ID": 941,
                        "Code": "043",
                        "Name": "Anzoátegui"
                    },
                    {
                        "ID": 942,
                        "Code": "055",
                        "Name": "Armero"
                    },
                    {
                        "ID": 943,
                        "Code": "067",
                        "Name": "Ataco"
                    },
                    {
                        "ID": 944,
                        "Code": "124",
                        "Name": "Cajamarca"
                    },
                    {
                        "ID": 945,
                        "Code": "148",
                        "Name": "Carmen de Apicala"
                    },
                    {
                        "ID": 946,
                        "Code": "152",
                        "Name": "Casabianca"
                    },
                    {
                        "ID": 947,
                        "Code": "168",
                        "Name": "Chaparral"
                    },
                    {
                        "ID": 948,
                        "Code": "200",
                        "Name": "Coello"
                    },
                    {
                        "ID": 949,
                        "Code": "217",
                        "Name": "Coyaima"
                    },
                    {
                        "ID": 950,
                        "Code": "226",
                        "Name": "Cunday"
                    },
                    {
                        "ID": 951,
                        "Code": "236",
                        "Name": "Dolores"
                    },
                    {
                        "ID": 952,
                        "Code": "268",
                        "Name": "Espinal"
                    },
                    {
                        "ID": 953,
                        "Code": "270",
                        "Name": "Falan"
                    },
                    {
                        "ID": 954,
                        "Code": "275",
                        "Name": "Flandes"
                    },
                    {
                        "ID": 955,
                        "Code": "283",
                        "Name": "Fresno"
                    },
                    {
                        "ID": 956,
                        "Code": "319",
                        "Name": "Guamo"
                    },
                    {
                        "ID": 957,
                        "Code": "347",
                        "Name": "Herveo"
                    },
                    {
                        "ID": 958,
                        "Code": "349",
                        "Name": "Honda"
                    },
                    {
                        "ID": 959,
                        "Code": "352",
                        "Name": "Icononzo"
                    },
                    {
                        "ID": 960,
                        "Code": "408",
                        "Name": "Lérida"
                    },
                    {
                        "ID": 961,
                        "Code": "411",
                        "Name": "Líbano"
                    },
                    {
                        "ID": 962,
                        "Code": "443",
                        "Name": "Mariquita"
                    },
                    {
                        "ID": 963,
                        "Code": "449",
                        "Name": "Melgar"
                    },
                    {
                        "ID": 964,
                        "Code": "461",
                        "Name": "Murillo"
                    },
                    {
                        "ID": 965,
                        "Code": "483",
                        "Name": "Natagaima"
                    },
                    {
                        "ID": 966,
                        "Code": "504",
                        "Name": "Ortega"
                    },
                    {
                        "ID": 967,
                        "Code": "520",
                        "Name": "Palocabildo"
                    },
                    {
                        "ID": 968,
                        "Code": "547",
                        "Name": "Piedras"
                    },
                    {
                        "ID": 969,
                        "Code": "555",
                        "Name": "Planadas"
                    },
                    {
                        "ID": 970,
                        "Code": "563",
                        "Name": "Prado"
                    },
                    {
                        "ID": 971,
                        "Code": "585",
                        "Name": "Purificación"
                    },
                    {
                        "ID": 972,
                        "Code": "616",
                        "Name": "Rio Blanco"
                    },
                    {
                        "ID": 973,
                        "Code": "622",
                        "Name": "Roncesvalles"
                    },
                    {
                        "ID": 974,
                        "Code": "624",
                        "Name": "Rovira"
                    },
                    {
                        "ID": 975,
                        "Code": "671",
                        "Name": "Saldaña"
                    },
                    {
                        "ID": 976,
                        "Code": "675",
                        "Name": "San Antonio"
                    },
                    {
                        "ID": 977,
                        "Code": "678",
                        "Name": "San Luis"
                    },
                    {
                        "ID": 978,
                        "Code": "686",
                        "Name": "Santa Isabel"
                    },
                    {
                        "ID": 979,
                        "Code": "770",
                        "Name": "Suárez"
                    },
                    {
                        "ID": 980,
                        "Code": "854",
                        "Name": "Valle de San Juan"
                    },
                    {
                        "ID": 981,
                        "Code": "861",
                        "Name": "Venadillo"
                    },
                    {
                        "ID": 982,
                        "Code": "870",
                        "Name": "Villahermosa"
                    },
                    {
                        "ID": 983,
                        "Code": "873",
                        "Name": "Villarrica"
                    }
                ];
            }
            else if (id == 23) {
                this.ciudades = [
                    {
                        "ID": 984,
                        "Code": "001",
                        "Name": "Cali"
                    },
                    {
                        "ID": 985,
                        "Code": "020",
                        "Name": "Alcalá"
                    },
                    {
                        "ID": 986,
                        "Code": "036",
                        "Name": "Andalucía"
                    },
                    {
                        "ID": 987,
                        "Code": "041",
                        "Name": "Ansermanuevo"
                    },
                    {
                        "ID": 988,
                        "Code": "054",
                        "Name": "Argelia"
                    },
                    {
                        "ID": 989,
                        "Code": "100",
                        "Name": "Bolívar"
                    },
                    {
                        "ID": 990,
                        "Code": "109",
                        "Name": "Buenaventura"
                    },
                    {
                        "ID": 991,
                        "Code": "111",
                        "Name": "Guadalajara de Buga"
                    },
                    {
                        "ID": 992,
                        "Code": "113",
                        "Name": "Bugalagrande"
                    },
                    {
                        "ID": 993,
                        "Code": "122",
                        "Name": "Caicedonia"
                    },
                    {
                        "ID": 994,
                        "Code": "126",
                        "Name": "Calima"
                    },
                    {
                        "ID": 995,
                        "Code": "130",
                        "Name": "Candelaria"
                    },
                    {
                        "ID": 996,
                        "Code": "147",
                        "Name": "Cartago"
                    },
                    {
                        "ID": 997,
                        "Code": "233",
                        "Name": "Dagua"
                    },
                    {
                        "ID": 998,
                        "Code": "243",
                        "Name": "El Águila"
                    },
                    {
                        "ID": 999,
                        "Code": "246",
                        "Name": "El Cairo"
                    },
                    {
                        "ID": 1000,
                        "Code": "248",
                        "Name": "El Cerrito"
                    },
                    {
                        "ID": 1001,
                        "Code": "250",
                        "Name": "El Dovio"
                    },
                    {
                        "ID": 1002,
                        "Code": "275",
                        "Name": "Florida"
                    },
                    {
                        "ID": 1003,
                        "Code": "306",
                        "Name": "Ginebra"
                    },
                    {
                        "ID": 1004,
                        "Code": "318",
                        "Name": "Guacarí"
                    },
                    {
                        "ID": 1005,
                        "Code": "364",
                        "Name": "Jamundí"
                    },
                    {
                        "ID": 1006,
                        "Code": "377",
                        "Name": "La Cumbre"
                    },
                    {
                        "ID": 1007,
                        "Code": "400",
                        "Name": "La Unión"
                    },
                    {
                        "ID": 1008,
                        "Code": "403",
                        "Name": "La Victoria"
                    },
                    {
                        "ID": 1009,
                        "Code": "497",
                        "Name": "Obando"
                    },
                    {
                        "ID": 1010,
                        "Code": "520",
                        "Name": "Palmira"
                    },
                    {
                        "ID": 1011,
                        "Code": "563",
                        "Name": "Pradera"
                    },
                    {
                        "ID": 1012,
                        "Code": "606",
                        "Name": "Restrepo"
                    },
                    {
                        "ID": 1013,
                        "Code": "616",
                        "Name": "Riofrío"
                    },
                    {
                        "ID": 1014,
                        "Code": "622",
                        "Name": "Roldanillo"
                    },
                    {
                        "ID": 1015,
                        "Code": "670",
                        "Name": "San Pedro"
                    },
                    {
                        "ID": 1016,
                        "Code": "736",
                        "Name": "Sevilla"
                    },
                    {
                        "ID": 1017,
                        "Code": "823",
                        "Name": "Toro"
                    },
                    {
                        "ID": 1018,
                        "Code": "828",
                        "Name": "Trujillo"
                    },
                    {
                        "ID": 1019,
                        "Code": "834",
                        "Name": "Tuluá"
                    },
                    {
                        "ID": 1020,
                        "Code": "845",
                        "Name": "Ulloa"
                    },
                    {
                        "ID": 1021,
                        "Code": "863",
                        "Name": "Versalles"
                    },
                    {
                        "ID": 1022,
                        "Code": "869",
                        "Name": "Vijes"
                    },
                    {
                        "ID": 1023,
                        "Code": "890",
                        "Name": "Yotoco"
                    },
                    {
                        "ID": 1024,
                        "Code": "892",
                        "Name": "Yumbo"
                    },
                    {
                        "ID": 1025,
                        "Code": "895",
                        "Name": "Zarzal"
                    }
                ];
            }
            else if (id == 24) {
                this.ciudades = [
                    {
                        "ID": 1026,
                        "Code": "01",
                        "Name": "Barranquilla"
                    },
                    {
                        "ID": 1027,
                        "Code": "06",
                        "Name": "Repelón"
                    },
                    {
                        "ID": 1028,
                        "Code": "20",
                        "Name": "Palmar de Varela"
                    },
                    {
                        "ID": 1029,
                        "Code": "21",
                        "Name": "Luruaco"
                    },
                    {
                        "ID": 1030,
                        "Code": "32",
                        "Name": "Tubará"
                    },
                    {
                        "ID": 1031,
                        "Code": "33",
                        "Name": "Malambo"
                    },
                    {
                        "ID": 1032,
                        "Code": "34",
                        "Name": "Sabanagrande"
                    },
                    {
                        "ID": 1033,
                        "Code": "36",
                        "Name": "Manatí"
                    },
                    {
                        "ID": 1034,
                        "Code": "37",
                        "Name": "Campo de La Cruz"
                    },
                    {
                        "ID": 1035,
                        "Code": "38",
                        "Name": "Sabanalarga"
                    },
                    {
                        "ID": 1036,
                        "Code": "41",
                        "Name": "Candelaria"
                    },
                    {
                        "ID": 1037,
                        "Code": "49",
                        "Name": "Piojó"
                    },
                    {
                        "ID": 1038,
                        "Code": "49",
                        "Name": "Usiacurí"
                    },
                    {
                        "ID": 1039,
                        "Code": "58",
                        "Name": "Polonuevo"
                    },
                    {
                        "ID": 1040,
                        "Code": "58",
                        "Name": "Soledad"
                    },
                    {
                        "ID": 1041,
                        "Code": "60",
                        "Name": "Ponedera"
                    },
                    {
                        "ID": 1042,
                        "Code": "70",
                        "Name": "Suan"
                    },
                    {
                        "ID": 1043,
                        "Code": "72",
                        "Name": "Juan de Acosta"
                    },
                    {
                        "ID": 1044,
                        "Code": "73",
                        "Name": "Puerto Colombia"
                    },
                    {
                        "ID": 1045,
                        "Code": "75",
                        "Name": "Santa Lucía"
                    },
                    {
                        "ID": 1046,
                        "Code": "78",
                        "Name": "Baranoa"
                    },
                    {
                        "ID": 1047,
                        "Code": "85",
                        "Name": "Santo Tomás"
                    },
                    {
                        "ID": 1048,
                        "Code": "96",
                        "Name": "Galapa"
                    }
                ];
            }
            else if (id == 25) {
                this.ciudades = [
                    {
                        "ID": 1049,
                        "Code": "001",
                        "Name": "Arauca"
                    },
                    {
                        "ID": 1050,
                        "Code": "065",
                        "Name": "Arauquita"
                    },
                    {
                        "ID": 1051,
                        "Code": "220",
                        "Name": "Cravo Norte"
                    },
                    {
                        "ID": 1052,
                        "Code": "300",
                        "Name": "Fortul"
                    },
                    {
                        "ID": 1053,
                        "Code": "591",
                        "Name": "Puerto Rondón"
                    },
                    {
                        "ID": 1054,
                        "Code": "736",
                        "Name": "Saravena"
                    },
                    {
                        "ID": 1055,
                        "Code": "794",
                        "Name": "Tame"
                    }
                ];
            }
            else if (id == 26) {
                this.ciudades = [
                    {
                        "ID": 1056,
                        "Code": "001",
                        "Name": "Yopal"
                    },
                    {
                        "ID": 1057,
                        "Code": "010",
                        "Name": "Aguazul"
                    },
                    {
                        "ID": 1058,
                        "Code": "015",
                        "Name": "Chámeza"
                    },
                    {
                        "ID": 1059,
                        "Code": "125",
                        "Name": "Hato Corozal"
                    },
                    {
                        "ID": 1060,
                        "Code": "136",
                        "Name": "La Salina"
                    },
                    {
                        "ID": 1061,
                        "Code": "139",
                        "Name": "Maní"
                    },
                    {
                        "ID": 1062,
                        "Code": "162",
                        "Name": "Monterrey"
                    },
                    {
                        "ID": 1063,
                        "Code": "225",
                        "Name": "Nunchía"
                    },
                    {
                        "ID": 1064,
                        "Code": "230",
                        "Name": "Orocué"
                    },
                    {
                        "ID": 1065,
                        "Code": "250",
                        "Name": "Paz de Ariporo"
                    },
                    {
                        "ID": 1066,
                        "Code": "263",
                        "Name": "Pore"
                    },
                    {
                        "ID": 1067,
                        "Code": "279",
                        "Name": "Recetor"
                    },
                    {
                        "ID": 1068,
                        "Code": "300",
                        "Name": "Sabanalarga"
                    },
                    {
                        "ID": 1069,
                        "Code": "315",
                        "Name": "Sácama"
                    },
                    {
                        "ID": 1070,
                        "Code": "325",
                        "Name": "San Luis de Gaceno"
                    },
                    {
                        "ID": 1071,
                        "Code": "400",
                        "Name": "Támara"
                    },
                    {
                        "ID": 1072,
                        "Code": "410",
                        "Name": "Tauramena"
                    },
                    {
                        "ID": 1073,
                        "Code": "430",
                        "Name": "Trinidad"
                    },
                    {
                        "ID": 1074,
                        "Code": "440",
                        "Name": "Villanueva"
                    }
                ];
            }
            else if (id == 27) {
                this.ciudades = [
                    {
                        "ID": 1075,
                        "Code": "001",
                        "Name": "Mocoa"
                    },
                    {
                        "ID": 1076,
                        "Code": "219",
                        "Name": "Colón"
                    },
                    {
                        "ID": 1077,
                        "Code": "320",
                        "Name": "Orito"
                    },
                    {
                        "ID": 1078,
                        "Code": "568",
                        "Name": "Puerto Asís"
                    },
                    {
                        "ID": 1079,
                        "Code": "569",
                        "Name": "Puerto Caicedo"
                    },
                    {
                        "ID": 1080,
                        "Code": "571",
                        "Name": "Puerto Guzmán"
                    },
                    {
                        "ID": 1081,
                        "Code": "573",
                        "Name": "Leguízamo"
                    },
                    {
                        "ID": 1082,
                        "Code": "749",
                        "Name": "Sibundoy"
                    },
                    {
                        "ID": 1083,
                        "Code": "755",
                        "Name": "San Francisco"
                    },
                    {
                        "ID": 1084,
                        "Code": "757",
                        "Name": "San Miguel"
                    },
                    {
                        "ID": 1085,
                        "Code": "760",
                        "Name": "Santiago"
                    },
                    {
                        "ID": 1086,
                        "Code": "865",
                        "Name": "Valle de Guamez"
                    },
                    {
                        "ID": 1087,
                        "Code": "885",
                        "Name": "Villagarzón"
                    }
                ];
            }
            else if (id == 28) {
                this.ciudades = [
                    {
                        "ID": 1088,
                        "Code": "001",
                        "Name": "San Andrés"
                    },
                    {
                        "ID": 1089,
                        "Code": "564",
                        "Name": "Providencia"
                    }
                ];
            }
            else if (id == 29) {
                this.ciudades = [
                    {
                        "ID": 1090,
                        "Code": "001",
                        "Name": "Leticia"
                    },
                    {
                        "ID": 1091,
                        "Code": "263",
                        "Name": "El Encanto"
                    },
                    {
                        "ID": 1092,
                        "Code": "405",
                        "Name": "La Chorrera"
                    },
                    {
                        "ID": 1093,
                        "Code": "407",
                        "Name": "La Pedrera"
                    },
                    {
                        "ID": 1094,
                        "Code": "430",
                        "Name": "La Victoria"
                    },
                    {
                        "ID": 1095,
                        "Code": "460",
                        "Name": "Miriti Paraná"
                    },
                    {
                        "ID": 1096,
                        "Code": "530",
                        "Name": "Puerto Alegría"
                    },
                    {
                        "ID": 1097,
                        "Code": "536",
                        "Name": "Puerto Arica"
                    },
                    {
                        "ID": 1098,
                        "Code": "540",
                        "Name": "Puerto Nariño"
                    },
                    {
                        "ID": 1099,
                        "Code": "669",
                        "Name": "Puerto Santander"
                    },
                    {
                        "ID": 1100,
                        "Code": "798",
                        "Name": "Tarapacá"
                    }
                ];
            }
            else if (id == 30) {
                this.ciudades = [
                    {
                        "ID": 1101,
                        "Code": "001",
                        "Name": "Inírida"
                    },
                    {
                        "ID": 1102,
                        "Code": "343",
                        "Name": "Barranco Minas"
                    },
                    {
                        "ID": 1103,
                        "Code": "663",
                        "Name": "Mapiripana"
                    },
                    {
                        "ID": 1104,
                        "Code": "883",
                        "Name": "San Felipe"
                    },
                    {
                        "ID": 1105,
                        "Code": "884",
                        "Name": "Puerto Colombia"
                    },
                    {
                        "ID": 1106,
                        "Code": "885",
                        "Name": "La Guadalupe"
                    },
                    {
                        "ID": 1107,
                        "Code": "886",
                        "Name": "Cacahual"
                    },
                    {
                        "ID": 1108,
                        "Code": "887",
                        "Name": "Pana Pana"
                    },
                    {
                        "ID": 1109,
                        "Code": "888",
                        "Name": "Morichal"
                    }
                ];
            }
            else if (id == 31) {
                this.ciudades = [
                    {
                        "ID": 1110,
                        "Code": "001",
                        "Name": "San José del Guaviare"
                    },
                    {
                        "ID": 1111,
                        "Code": "015",
                        "Name": "Calamar"
                    },
                    {
                        "ID": 1112,
                        "Code": "025",
                        "Name": "El Retorno"
                    },
                    {
                        "ID": 1113,
                        "Code": "200",
                        "Name": "Miraflores"
                    }
                ];
            }
            else if (id == 32) {
                this.ciudades = [
                    {
                        "ID": 1114,
                        "Code": "001",
                        "Name": "Mitú"
                    },
                    {
                        "ID": 1115,
                        "Code": "161",
                        "Name": "Caruru"
                    },
                    {
                        "ID": 1116,
                        "Code": "511",
                        "Name": "Pacoa"
                    },
                    {
                        "ID": 1117,
                        "Code": "666",
                        "Name": "Taraira"
                    },
                    {
                        "ID": 1118,
                        "Code": "777",
                        "Name": "Papunaua"
                    },
                    {
                        "ID": 1119,
                        "Code": "889",
                        "Name": "Yavaraté"
                    }
                ];
            }
            else if (id == 33) {
                this.ciudades = [
                    {
                        "ID": 1120,
                        "Code": "001",
                        "Name": "Puerto Carreño"
                    },
                    {
                        "ID": 1121,
                        "Code": "524",
                        "Name": "La Primavera"
                    },
                    {
                        "ID": 1122,
                        "Code": "524",
                        "Name": "Santa Rosalía"
                    },
                    {
                        "ID": 1123,
                        "Code": "773",
                        "Name": "Cumaribo"
                    }
                ];
            }
        }
    }

    // getters
    get Direccion() {
        return this.formRegistro.get('Direccion');
    }

    get Complemento() {
        return this.formRegistro.get('Complemento');
    }

    get Departamento() {
        return this.formRegistro.get('Departamento');
    }

    get Ciudad() {
        return this.formRegistro.get('Ciudad');
    }

    continuar() {
        if (this.formRegistro.valid) {
            this.registroService.ubicacion(+localStorage.getItem('personaId'),
                this.formRegistro.get('Direccion').value, this.formRegistro.get('Complemento').value,
                this.formRegistro.get('Ciudad').value.ID, this.formRegistro.get('Ciudad').value.Name,
                this.formRegistro.get('Departamento').value.ID, this.formRegistro.get('Departamento').value.Name)
                .subscribe((Respuesta: any) => {
                    if (Respuesta) {
                        const identificadorOTP = Respuesta.identificadorOTP;
                        localStorage.setItem('identificadorOTP', identificadorOTP);
                        localStorage.setItem('solicitud', Respuesta.numSolicitudCert);
                        if (!Respuesta.solicitarPinCertificado) {
                            localStorage.setItem('skip', '1');
                        }
                        this.router.navigateByUrl('registro/datos/confirma');
                    } else {
                        this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                    }
                }, (error: any) => {
                    this.router.navigateByUrl('main/errorMifirma', { skipLocationChange: true });
                });
        } else {
            this.showInputError();
        }
    }

    showInputError(): void {
        for (const field in this.formRegistro.controls) {
            const control = this.formRegistro.get(field);

            if (control.invalid) {
                control.markAsTouched();
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.toastr.clear();
    }
}
