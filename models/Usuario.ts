import {Schema, model , Document} from 'mongoose';


import bcrypt from 'bcryptjs';

//De esta forma podemos crear opciones de valores para una propiedad
let rolesValidos ={
    values:['admin','usuario'],
    message:'{VALUE} no es un rol valido'
};

//De esta forma se crea una coleccion que va a guardar los tipos
//de datos especificados
const usuarioSchema= new Schema({
    nombre:{
        type: String,
        required:[true, 'El nombre es necesario']
    },
    avatar:{
        type: String,
        default:'av-1.png'
    },
    email:{
        type:String,
        unique: true,
        required:[true, 'Ya en uso']
    },
    role:{
        type:String,
        required:[true,'El role es requerido'],
        default:'usuario',
        enum: rolesValidos
    },

    google:{
        type: Boolean,
        default:false
    }
    ,password:{
        type: String,
        required:[true,'La contraseña es necesaria']
    }
});

export interface IUsuario extends Document{
nombre ?:String;
avatar:String;
email:String;
role:String;
google:Boolean;
password:String;


//Asi le creamos un metodo a un schema de mongo
compararPassword(password: string):boolean;

}

//De eesta forma le creamos un metodo al modelo del schema de la bd
usuarioSchema.method('compararPassword', function(password :string =''): boolean{
 //Esto retorna un boolean si las password recibida es igual
    return bcrypt.compareSync(password, this.password);
});

//Asi se crea el modelo en mongo , con el nombre de la coleccion
export const Usuario= model<IUsuario>('Usuario', usuarioSchema);