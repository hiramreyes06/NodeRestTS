import {Router, Request, Response} from 'express';

import { Usuario } from '../models/Usuario';

//Esta libreria se usa para encriptar string
import bcrypt from 'bcryptjs';
import Token from '../clases/token';

//Middleware personalizado que creamos
import { verificarToken } from '../middlewares/autenticacion';

const usuarioRoutes= Router();


usuarioRoutes.post(`/login`, (req:Request, res: Response) =>{

const body= req.body;

Usuario.findOne({ email: body.email}, (err, usuarioDB)=>{

if( err) throw new err;

if( ! usuarioDB){

  return res.json({
      ok:false,
      message:'Usuario/contraseña no encontrada'  
  });

  
}


if( usuarioDB.compararPassword(body.password)){

    const tokenUser= Token.crearJwToken({
        _id: usuarioDB._id,
        nombre: usuarioDB.nombre,
        email: usuarioDB.email,
        avatar: usuarioDB.avatar
    });

    res.json({
        ok:true,
        tokenUser
    });

  }
  else{

    res.json({
        ok:false,
        message:'usuario/Contraseña no son correctos'
    })

  }




}  );


});

usuarioRoutes.put(`/actualizar`, verificarToken, (req:any, res:Response) =>{

    //Asi eligimos entre valores nullos o validados por el token
const user={
    nombre: req.body.nombre || req.usuario.nombre,
    email: req.body.email || req.usuario.email,
    avatar: req.body.avatar || req.usuario.avatar
}

Usuario.findByIdAndUpdate( req.usuario._id, user, {new :true},

    (err, userActualizado)=>{

        if(err) throw err;

        if( !userActualizado){
            return res.json({
                ok:false,
                message:'No existe el usuario con el id'
            });

        }


        //Al actualizar el usuario tenemos que actualizar el token
        //con los nuevos
        const tokenUser= Token.crearJwToken({
            _id: userActualizado._id,
            nombre: userActualizado.nombre,
            email: userActualizado.email,
            avatar: userActualizado.avatar
        });

        res.json({
            ok:true,
            userActualizado,
            tokenUser
        });

    } );


});


usuarioRoutes.post(`/crear`, (req: Request, res: Response) =>{

    const usuario={
        nombre: req.body.nombre,
        avatar: req.body.avatar,
        email: req.body.email ,
        //Asi encriptamos la contraseña
        password: bcrypt.hashSync(req.body.password,10)
        };

Usuario.create( usuario).then( usuarioRegistrado =>{

    res.json({
        ok:true,
        usuarioRegistrado
    });

}).catch( err =>{


    res.json({
        ok:false,
        message:'No se pudo registrar al usuario'
    });
    console.log('Error al registrar usuario',err);
    });

});


usuarioRoutes.get(`/obtener`, (req: Request, res: Response) =>{




res.json({
    ok:true,
    message:"asdas"
});

});

export default usuarioRoutes;