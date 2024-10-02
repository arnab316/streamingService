import express from 'express'
import {config} from './config/serverConfig.js'
import bodyParser from 'body-parser';
import apiRoutes from './routes/videoRoutes.js'
const startAndStop = async()=>{
 const app = express();
 const PORT = config.PORT
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use('/api/v1', apiRoutes);
 app.listen(PORT, ()=>{
     console.log(`Server is listening at http://localhost:${PORT}`);
 });
    
}

startAndStop()