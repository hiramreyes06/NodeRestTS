import express = require('express');



export default class Server{

    public app: express.Application;
    public port: number;

    constructor( puerto: number){
        this.port= puerto;    
        this.app= express();
    }

    //Para inicializar express en una sola instancia en la aplicacion
    //Patron de diseño SingleTon
    //Al llamar este metodo inicia el servidor
    static init (puerto:number){

        return new Server(puerto);
    }

    start(callback: Function){

        this.app.listen( this.port, callback() );

    }

    


}