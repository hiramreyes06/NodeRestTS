import { Router, Request, Response } from 'express';

import { mapa } from '../clases/socket';
import { verificarToken } from '../middlewares/autenticacion';



 const mapaRoutes= Router();


 mapaRoutes.get('/marcadores', verificarToken,  (req:any, res:Response) =>{


res.json( mapa.getMarcadores() );


 } );


 export default mapaRoutes;