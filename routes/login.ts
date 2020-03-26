import {Router, Request, Response} from "express";

const loginRoutes= Router();

loginRoutes.get(`/obtener`, (req:Request, res:Response) =>{

res.json({
    ok:true,
    message:"Usuarios bien"
});

});

export default loginRoutes;