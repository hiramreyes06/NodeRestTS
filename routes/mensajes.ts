import { Router, Request, Response } from 'express';

import Server from '../clases/server';


const mensajesRoutes= Router();



mensajesRoutes.post('/publico', (req:any, res: Response) =>{

Server.instance.io.emit('mensaje', {de:req.body._id, cuerpo: req.body.cuerpo})

res.json({
    de:req.body._id,
    cuerpo: req.body.cuerpo
});


});







export default mensajesRoutes;
