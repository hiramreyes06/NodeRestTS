//Asi elige el ambiente de desarrollo en el que esta, desarrollo o produccion
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//Se tiene que agregar y configurar previamente varables globales de
//entorno en heroku 

//Automaticamente toma el valor de la variable global en produccion o en
//desarrollo
export const SERVER_PORT: number = Number( process.env.PORT ) || 3000;

//Toma la variable de entorno 
export const seed:string = process.env.SEED || 'el-string-mas-segura-posible';

//Este el key de la api de google para la autenticacion de usuarios
export const CLIENT_ID: string='156692169272-0juufebl9iev6ro0c0g2t51o3l9ng6r7.apps.googleusercontent.com';

let urlDB;

//Dependiendo del ambiente de desarrollo toma la url de la base de datos
if( process.env.NODE_ENV === 'dev'){
    urlDB= 'mongodb://localhost:27017/fotosgram';
}else{
    //Asi agregamos el link con el que se va a conectar mongoose
    urlDB= process.env.MONGO_URI;
}

//Asi creamos una variable para en desarrollo con el links
process.env.URLDB= urlDB;



