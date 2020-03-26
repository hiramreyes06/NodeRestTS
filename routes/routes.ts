import express from 'express';

import { Request, Response} from 'express'

const app= express();

app.get(`/`, ( request: Request ,response:Response)=>{

  response.json({
      ok:true,
      message:"Todo bien"
  });

});

app.use(require('./login'));

module.exports= app;