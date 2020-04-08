import jwt from 'jsonwebtoken';
import { seed } from '../global/environment';


export default class Token{

    //Esta seed es privada para encriptar el token
    private static seed: string= seed;
    private static caducidad :string='30d';

    constructor(){

    }

    //AL crear un metodo statico no necesitamos crear el objeto para
    //acceder al metodo desde otras clases
    //Este metodo retorna el token generado en bsae al payload los datos
    //que mandemos y la seed
    static crearJwToken(payload:any):string {

        //Ejecutamos el metodo firmar para generar el token
     return jwt.sign({
         usuario: payload
     }, this.seed, { expiresIn: this.caducidad})   
    };


    static validarToken( userToken:string){

        return new Promise( (resolve, reject) =>{

            
        jwt.verify( userToken, this.seed, (err, decoded )=>{

            if(err){
                reject();
            }else{
                resolve(decoded);
            }
     



        } );



        });


    }



}