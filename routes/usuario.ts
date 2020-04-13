import {Router, Request, Response} from 'express';

import { Usuario, IUsuario } from '../models/Usuario';

//Esta libreria se usa para encriptar string
import bcrypt from 'bcryptjs';
import Token from '../clases/token';

//Middleware personalizado que creamos
import { verificarToken, adminRole } from '../middlewares/autenticacion';
import { CLIENT_ID } from '../global/environment';


//Le falta typescript a esta madre
const  {OAuth2Client} = require ('google-auth-library');
const client = new OAuth2Client (CLIENT_ID);

const usuarioRoutes= Router();




//Autenticacion con google

usuarioRoutes.post('/google', async (req:any, res: Response) =>{

 

        const userToken= req.get('x-token');

    //De esta forma guardamos el token que viene por el header personalizado
    

    //Para usar  esta peticion debe ser asincrona para esperar
    //que la promesa haya sido resuelta
    const usuarioGoogle= await verify(userToken)
    .catch( err =>{

        res.status(404).json({
            ok:false,
            message:'Token de google no valido'
            });
        
        });

      

        //Asi verificamos si el usuario ya ha sido registrado con el email
       //Es mejor utilizar findOne para que no regrese un arreglo
        Usuario.findOne({ email: usuarioGoogle.email }, '-password' , (err, usuarioBD) =>{

            if(err){
                return res.json({
                    ok:false,
                    message:'Error con el usuario'
                })
            }

            //Existe el usuario
            if( usuarioBD){

                //Si el usuario no esta registrado por google
                if( usuarioBD.google === false ){
                    return res.status(401).json({
                        ok:false,
                        message:'Ya estas registrado, necesitas iniciar sesion'
                    });
                }else{

                    //Si el usuario ya esta registrado pero usa la
                    // autenticacion de google, solo se verifica el token 

                    const tokenUser= Token.crearJwToken({
                        _id: usuarioBD._id,
                        nombre: usuarioBD.nombre,
                        email: usuarioBD.email,
                        role: usuarioBD.role
                    });
                
                    res.json({
                        ok:true,
                        message:'El usuario ya estaba registrado, google token valido',
                        usuario: usuarioBD,
                        tokenUser
                    });    


                }


            }//Si el usuario no existe y se esta registrado con google
            else{



                const usuario={
                    nombre: usuarioGoogle.name,
                    avatar: usuarioGoogle.picture,
                    email: usuarioGoogle.email ,
                    role:'usuario',
                    google:true,
                    //Asi encriptamos la contraseña
                    password: ':)'
                    };

                    

                Usuario.create( usuario ).then( usuarioRegistrado =>{


                    const tokenUser= Token.crearJwToken({
                        _id: usuarioRegistrado._id,
                        nombre: usuarioRegistrado.nombre,
                        email: usuarioRegistrado.email,
                        role: usuarioRegistrado.role
                    });

                    delete usuarioRegistrado.password;

                    res.json({
                        ok:true,
                        usuario: usuarioRegistrado,
                        tokenUser
                    });


                }).catch( err =>{

                    res.status(404).json({
                        ok:false,
                        message:'No se puedo registrar con google',
                        err
                    })

                });


            }


        });

       

    });
    


//Esta funcion recibe un token de google y lo valida para retornar
//el payload asincronamente
async function verify(token:string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3
    });
    //Esta contiene la informacion completa del token del usuario
    const payload = ticket.getPayload();
    // const userid = payload['sub'];

    return payload;

  }




/*Autenticacion normal con express y mongo*/


usuarioRoutes.get('/pagina', verificarToken , async(req:any, res:Response) =>{

const pagina= Number (req.query.pagina) || 1;
let skip = pagina -1;
skip *= 10; 

 await Usuario.find({}, '-password')
.limit(10)
.sort({_id :-1})
.skip(skip)
.exec( (err, usuarios) =>{

if(err){
    return res.status(400).json({
        ok:false,
        message:'Error al buscar usuarios'
    });
}

res.json({
    ok:true,
    usuarios
});

 });


});

// adminRole mejor no , esta a la vista de todos los usuarios
usuarioRoutes.get('/termino',verificarToken, async(req:any, res:Response) =>{

const termino = new RegExp( req.query.termino,'i') ;

//Es necesario el as para que typescript no tenga conflicto con el regez
await Usuario.find( {nombre: termino as any } ,'-password') 
.limit(10)
.exec( (err:any, usuarios:any) =>{

if(err) throw err;

if(! usuarios){
return res.status(404).json({
    ok:false,
    message:'No se encontro el usuario'
    });

}


res.json({
ok:true,
usuarios
});


});


});





usuarioRoutes.get('/nmUsuarios', verificarToken, (req:any, res: Response)=>{


Usuario.countDocuments({}, (err, nmUsuarios) =>{


if(err) throw err;


   return res.json({
        ok:true,
        nmUsuarios
        
    });


});



});

usuarioRoutes.post(`/login`, (req:Request, res: Response) =>{

const body= req.body;

Usuario.findOne({ email: body.email}, (err, usuarioBD:IUsuario)=>{

if( err) throw new err;

if( ! usuarioBD){

  

  return res.status(400).json({
      ok:false,
      message:'Usuario/contraseña no encontrada'  
  });

  
}


if( (body.password) && usuarioBD.compararPassword(body.password)){

    const token= Token.crearJwToken({
        _id: usuarioBD._id,
        nombre: usuarioBD.nombre,
        email: usuarioBD.email,
        role: usuarioBD.role
    });

    

    res.json({
        ok:true,
        usuario:{
            avatar: usuarioBD.avatar,
            role: usuarioBD.role,
            google: usuarioBD.google,
            _id: usuarioBD._id,
            nombre: usuarioBD.nombre,
            email: usuarioBD.email
        },
        token
    });

  }
  else{

    res.status(400).json({
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
            role: userActualizado.role
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
        avatar: req.body.avatar || 'https://res.cloudinary.com/hiramreyes06/image/upload/v1586800939/fotosGram/kwg2dkdgmht0gkjd63wf.jpg',
        email: req.body.email ,
        role:req.body.role,
        //Asi encriptamos la contraseña
        password: bcrypt.hashSync(req.body.password,10)
        };

Usuario.create( usuario).then( usuarioRegistrado =>{


    delete usuarioRegistrado['password'];

    res.json({
        ok:true,
        usuarioRegistrado
    });
    

}).catch( err =>{


    res.status(400).json({
        ok:false,
        message:'No se pudo registrar al usuario',
        err
    });
    
    });

});


usuarioRoutes.get(`/token`, verificarToken, (req:any, res: Response) =>{


res.json({
    ok:true,
    token: req.usuario
});

});

export default usuarioRoutes;