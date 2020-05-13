import { Marcador } from "./marcador";

//Sirve para manejar los marcadores y la informacion del mapa
export class Mapa{

    //Va a tener un objeto que sus propiedades va hacer del
    //tipo marcador


    private marcadores: { [key:string] : Marcador } = {
        //ASi se crea la estructura de la cual nos referiremos a cada obj con el key y o ID
       '1': {
            id: '1',
            nombre: 'Carnitas lokas',
            lng: -103.18958957306585,
            lat: 20.293045257196084,
            color: '#dd8fee'
          },
         '2': {
            id: '2',
            nombre: 'Tu negocio',
            lng: -103.19124617492014, 
            lat: 20.291613337245167,
            color: '#790af0'
          },
         '3': {
            id: '3',
            nombre: 'Aqui se pistea agusto',
            lng: -103.18695727729175, 
            lat: 20.28904735626668,
            color: '#19884b'
          }

    }

    constructor(){}

    agregarMarcador( marcador:Marcador){
        this.marcadores[ marcador.id ] = marcador;
    }

    getMarcadores(){
        return this.marcadores;
    }

    borrarMarcador( id:string ){
        //Asi borramos lo que tenga la propiedad id del marcador
        delete this.marcadores[id];
        return this.getMarcadores();
    }

    //Asi actualizamos progresivamente las coordenadas del
    //marcador que estemos enviando del arreglo de marcadores
    moverMarcador( marcador: Marcador){

        // console.log('Se esta moviendo perro: ',marcador);

        try{

            //Modificamos directamente la propiedad .lng del marcador
        this.marcadores[marcador.id].lng= marcador.lng;

        this.marcadores[marcador.id].lat= marcador.lat;

        }catch( err) {
            console.warn('Aveces pasan estas pendejadas',err);
        }
        
    }


}


