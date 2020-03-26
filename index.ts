import Server from './clases/server'
import {SERVER_PORT} from './global/environment';

const server = Server.init( SERVER_PORT );

//Asi usamos las rutas que tenga el router
server.app.use( require('./routes/routes'));

//De esta forma utilizamos el singleton para crear sola una instancia en
//toda la aplicacion



server.start( ()=>{

    console.log('Escuchando el pueto 3000');
} );