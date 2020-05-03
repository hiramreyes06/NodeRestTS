import express from 'express';


//socket io
import socketIO from 'socket.io';
import http from 'http';
import { SERVER_PORT } from '../global/environment';

import * as socket from './socket';


export default class Server{

    public app: express.Application;
    public port: number;


    //Socket io 

    private static _intance: Server;

    public io: socketIO.Server;
    private httpServer: http.Server;

    constructor( ){
        this.port= SERVER_PORT;    
        this.app= express();


        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }


    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    private escucharSockets() {

        
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            

            // Conectar cliente
            socket.conectarCliente( cliente, this.io );


            // Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // Obtener usuarios activos
            socket.obtenerUsuarios( cliente, this.io );

            // Mensajes
            socket.mensaje( cliente, this.io );

            //Posts
            socket.post( cliente, this.io);

            // Desconectar
            socket.desconectar( cliente, this.io );    
            

        });

    }

    //Para inicializar express en una sola instancia en la aplicacion
    //Patron de diseño SingleTon
    //Al llamar este metodo inicia el servidor
    // static init (puerto:number){

    //     return new Server(puerto);
    // }

    start(callback: Function){

        //Cambio para socket io
        this.httpServer.listen( this.port, callback() );

    }

    


}