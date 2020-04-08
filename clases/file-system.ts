
import { IFileUpload } from '../interfaces/fileUpload';

import path from 'path';

import fs from 'fs';

import uniqid from 'uniqid';



//Necesitamos poder exportar esta clase para usarla
export default class FileSystem{

constructor(){};

//Tenemos que convertir esta funcion a una promesa para esperar a que 
//se complete
guardarImagenTemporal( file: IFileUpload, userId: string){


return new Promise( (resolve,reject) =>{



    const path = this.crearCarpetaUsuario(userId);

    const nombreArchivo= this.generarNombreUnico(file.name);
    
    //Mover archivo de la carpeta temp a la del usuar
    file.mv(`${path}/${ nombreArchivo}`, (err:any)=>{
    
    if(err){
        console.log(err);
        reject(err);
    }

    resolve();
    
    } );



});



}

private generarNombreUnico(nombreOriginal: string) :string{

const nombreArr= nombreOriginal.split('.');
const extension= nombreArr[ nombreArr.length-1];

const idUnico= uniqid();
return `${ idUnico }.${extension}`;
}


private crearCarpetaUsuario(userId: string): string{

    //Ruta de la carpeta del usuario
   const pathUser= path.resolve(__dirname,'../uploads/', userId);  
//    console.log(pathUser);

   const pathUserTemp= pathUser+'/temp';

   const existe= fs.existsSync( pathUser);

   if(! existe){
       fs.mkdirSync(pathUser);
       fs.mkdirSync(pathUserTemp);
   }


   return pathUserTemp;
}


imagenesDeTempHaciaPost(userId: string){

    const pathUserTemp= path.resolve(__dirname,'../uploads/', userId,'temp');
    const pathUserPost= path.resolve(__dirname,'../uploads/', userId,'post');

    if(!fs.existsSync(pathUserTemp)){

        return [];
    }
    if(!fs.existsSync(pathUserPost)){

        fs.mkdirSync(pathUserPost);
    }

    const imagenesTemp= this.obtenerImagnesEnTemp( userId );

    //Asi movemos de lugar las imagenes de temp a post
    imagenesTemp.forEach( imagen =>{
        fs.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
    });

    //Esto retorna el nombre de las imagenes movidas a pst
    return imagenesTemp;

 }

 private obtenerImagnesEnTemp(userId:string){

    const pathUserPost= path.resolve(__dirname,'../uploads/', userId,'temp');
    //Se obtiene un arreglo de todos los archivos en temp
    //si no existe alguno retorna null
    return fs.readdirSync(pathUserPost) || [];
 }


 getFotoUrl(usuarioId:string, img: string): string{

    const pathUserImg= path.resolve(__dirname,'../uploads/', usuarioId,'post',img);

   const existe= fs.existsSync(pathUserImg);

    if(!existe){
      //retorna la foto de 404 en assets
       return path.resolve(__dirname,'../assets/imgs/404.jpg');
    }
 
   return pathUserImg;
 
 
    }
}