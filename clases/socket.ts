
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from './usuarios-lista';
import { Usuario } from './usuario';




export const usuariosConectados = new UsuariosLista();


/*
Los listeners creados para socket no puede ser emitido desde el mismo backend, solo desde
afuera como el backend
*/

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

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

       

    });

}

export const post = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('post', (  payload: { id: string }  ) => {

        console.log('Post recibido', payload );

        io.emit('post-nuevo', payload );

       

    });

}



// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string }, callback: any  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos',  usuariosConectados.getLista() );

        //Arreglarlo para que retorne json
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