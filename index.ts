import Server from './clases/server'
import {SERVER_PORT} from './global/environment';

import {Router, Request, Response} from 'express';

import usuarioRoutes from './routes/usuario';

import mongoose from 'mongoose';

import bodyParser from 'body-parser';



const prueba= Router();

const server = Server.init( SERVER_PORT );

//Asi pasamos la data recbida por peticiones por un middleware para obtener
//el formato json
server.app.use( bodyParser.urlencoded({extended:true}))
server.app.use(bodyParser.json());


//Asi usamos las rutas que tenga el router
// server.app.use( require('./routes/routes'));


server.app.use(`/usuario`,usuarioRoutes);

//agregamos el link del local host /nombreBasedeDatos



mongoose.connect('mongodb://localhost:27017/fotosgram',
{ useNewUrlParser:true,
useFindAndModify:false,
useCreateIndex:true,
useUnifiedTopology:true }, (err)=>{


    if( err ) throw err;

    console.log('Base de datos online');
} );

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