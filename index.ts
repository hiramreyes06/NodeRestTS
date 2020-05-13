import Server from './clases/server'

import { SERVER_PORT } from './global/environment'
import cors, { CorsOptions } from 'cors';

 
import {Router, Request, Response} from 'express';

import usuarioRoutes from './routes/usuario';
import postRoutes from './routes/Post';

import mensajesRoutes from './routes/mensajes';

import mapaRoutes from './routes/mapa';


import mongoose from 'mongoose';

import bodyParser from 'body-parser';

import fileUpload from 'express-fileupload';





const prueba= Router();

//Modificacion para socket io
const server = Server.instance;

const corsOptions: CorsOptions ={
methods: ['GET','PUT','DELETE','POST'],
credentials:true,
origin:true
};



server.app.use(cors(corsOptions));

//Asi pasamos la data recbida por peticiones por un middleware para obtener
//el formato json
server.app.use( bodyParser.urlencoded({extended:true}))
server.app.use(bodyParser.json());


//File upload para subir archivos
//Si detecta algun  archivo en la peticion estara en el req.files
//Debemos que agregar la propiedad para que no guarde un archivo vacio
server.app.use(fileUpload({
    useTempFiles:true
}));

//Asi usamos las rutas que tenga el router
// server.app.use( require('./routes/routes'));


server.app.use(`/usuario`,usuarioRoutes);
server.app.use(`/post`,postRoutes);
server.app.use('/mensajes',mensajesRoutes);
server.app.use('/mapa', mapaRoutes);


//agregamos el link del local host /nombreBasedeDatos


//El as string es necesario para que typesctipt reconosca la variable
//global como un string
mongoose.connect(process.env.URLDB as string,
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

    console.log(`Escuchando el puerto: ${SERVER_PORT}`);
} );