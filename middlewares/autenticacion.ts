import {Response, Request, NextFunction} from 'express'
import Token from '../clases/token';


export const verificarToken =( req:any, res: Response, next: NextFunction)=>{

    //Asi recibimos y leemos datos de un header personalizado
const userToken= req.get('x-token') || '';

Token.validarToken( userToken ).then( (decoded:any) =>{

    req.usuario= decoded.usuario;
    // console.log('token valido ', decoded.usuario);
    next();
}).catch(err =>{ 

    res.json({
        ok:false,
        err
    });

}) ;

};