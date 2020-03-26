import express from 'express'
import { Request, Response} from 'express'
const app = express();

app.get(`/usuario`, (req:Request, res:Response)=>{

res.json({
ok: true,
message:"Todo bien"

});


});



module.exports= app;