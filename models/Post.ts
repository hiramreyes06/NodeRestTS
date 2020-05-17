import { Schema, Document ,model } from 'mongoose';

//Asi se pueden crear esquemas anidados, donde podemos quitar el id automatico
const multimedia = new Schema({
   tipo:{
       type:String
   },
   url:{
    type:String
   },
    _id : {id:false}
})

const postSchema= new Schema({
fecha:{
    type: Date
},
titulo:{
    type:String,
    required:[true,'El titulo es necesesario']
},
texto:{
    type: String,
},
coords:{
    lng:{
        type:Number
    },
    lat:{
        type:Number
    }
},
multimedia:[ multimedia ],

//de esta forma se pueden relacionar datos entre modelos de la bd
usuario:{
    type: Schema.Types.ObjectId,
    ref:'Usuario',
    required:[true,'Se necesita un autor']
}


});


/*
De esta forma le declaramos al modelo schema que antes ejecutar la funcion
que guarda el documento en la bd le complete la propieddad fecha, o puede
recibir los datos opcional 
*/
postSchema.pre<IPost>('save', function(){
    this.fecha = new Date();
});



export interface IPost extends Document{
fecha:Date;
titulo:string;
texto:string;
coords:string;
multimedia:string[];
usuario:string;

};

//Siempre necesitamos exportar el modelo para manejar los metodos de mongo
export const Post= model<IPost>('Post', postSchema);