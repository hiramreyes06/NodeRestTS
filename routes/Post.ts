import { Router, Response, Request } from 'express';


import { verificarToken } from '../middlewares/autenticacion';

import { Post } from '../models/Post';



const postRoutes= Router();


postRoutes.get(`/obtener`, async (req: Request, res: Response) =>{

var pagina= Number(req.query.pagina) || 1;
let skip= pagina-1;
skip *= 10;


const posts= await Post.find()
.sort( {_id: -1})
.skip(skip)
.limit(10)
.populate('usuario', '-password')
.exec( );

// (err, posts) =>{

//     if(err) throw err;
    
//     if(!posts){
//         return res.json({
//             ok:false,
//             message:'No existen posts'
//         });
//     }
    
//     res.json({
//     ok:true,
//     posts
//     });
    
//     }
    res.json({
    ok:true,
    pagina,
    posts
    });

});


postRoutes.get(`/id` , verificarToken, (req:Request, res:Response) =>{

    const id= req.query.id;

    Post.findById(id , async (err, post) =>{

        if(err) throw err;

        if(! post){

            return res.json({
                ok:false,
                message:'Post no encontrado'
            });
        }

      await  post.populate('usuario', '-password').execPopulate();

        res.json({
            ok:true,
            post
        });



    });

});

postRoutes.post(`/crear`, verificarToken, (req:any, res:Response) =>{

const post={
titulo: req.body.titulo,
texto: req.body.texto,
coords: req.body.coords,
imgs: req.body.imgs,
usuario: req.usuario._id
}

//Cuando rellenamos los datos relacionados con un populate tenemos que
//Convertir la funcion a asincrona para que rellene los datos
Post.create( post).then(async postCreado =>{

//Asi se rellena la proiedad usuario con los datos por el id 
//como segundo argumento se puede especificar que propiedades rellenas y
//cuales propiedades no rellenar como la contraseña
  await  postCreado.populate('usuario', '-password').execPopulate()


    res.json({
        ok:true,
        postCreado
    });

}).catch(err =>{ console.log(err)

    res.json({
        ok:false,
        message:'No se pudo crear post'
    });

});
 



});



export default postRoutes;