
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from './usuarios-lista';
import { Usuario } from './usuario';

import { Mapa } from './mapa';
import { Marcador } from './marcador';



export const mapa=new Mapa();

export const usuariosConectados = new UsuariosLista();


/*
Los listeners creados para socket no puede ser emitido desde el mismo backend, solo desde
afuera como el backend
*/


//Eventos de mapa
//EL cliente es la instancia de la app y el io es el server de express
export const mapaSockets = ( cliente: Socket, io: socketIO.Server ) => {

    //Este escucha el evento
    cliente.on('marcador-nuevo', (marcador: Marcador) =>{
        
        mapa.agregarMarcador( marcador );

        //console.log('Se agrego un marcador');
        //el nombre del evento es diferente uno emite y otro escucha
        cliente.broadcast.emit('marcador-nuevo', marcador);

    });


    cliente.on('marcador-borrar', (id: string ) =>{

        console.log('Se borrara: ', id);

        //Los datos pueden estar en un BD, este ejemplo simula la estructura
        mapa.borrarMarcador( id );
        
        //De esta forma emitimos un evento para todos menos quien la mando
        cliente.broadcast.emit( 'marcador-borrar', id );
        
    }); 

    cliente.on('marcador-mover', (marcador: Marcador ) =>{

        //Asi movemos el marcador
        mapa.moverMarcador(marcador);

       
        
        //De esta forma emitimos un evento para todos menos quien la mando
        cliente.broadcast.emit( 'marcador-mover', marcador );
        
    }); 

   

}

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}


export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {

        

        io.emit('mensaje-nuevo', payload );

       

    });

}

export const post = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('post', (  payload: { id: string }  ) => {

        

        io.emit('post-nuevo', payload );

       

    });

}



// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string }, callback: Function  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos',  usuariosConectados.getLista() );


        console.log('Cliente conectado');
        // console.log(callback);

        // // Arreglarlo para que retorne json
        // callback({
        //     ok:true,
        //     message:`usuario ${payload.nombre} configurado`
        // })

       
    });

}



// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}