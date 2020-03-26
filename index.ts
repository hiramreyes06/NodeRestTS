import Server from './clases/server'
import {SERVER_PORT} from './global/environment';

import {Router, Request, Response} from 'express';

import loginRoutes from './routes/login';

const prueba= Router();

const server = Server.init( SERVER_PORT );

server.app.use(`/usuario`,loginRoutes)

//Asi usamos las rutas que tenga el router
// server.app.use( require('./routes/routes'));

prueba.get(`/`, (req:Request, res:Response) =>{

    res.json({
        ok:true,
        message:"Rest esta bien"
    });
});

server.app.use(prueba);

//De esta forma utilizamos el singleton para crear sola una instancia en
//toda la aplicacion



server.start( ()=>{

    console.log('Escuchando el pueto 3000');
} );