import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import express from 'express'
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import SerialPort from 'serialport'
let serialPort = new SerialPort("COM4", { baudRate: 9600 });
import { verifyUser } from './controllers/fingerprintController.js';
serialPort.on('open',function() {
    console.log('Serial Port ' + "COM4" + ' is opened.');
});

import memberRoutes from "./routes/admin/memberRoutes.js";
import staffRoutes from "./routes/admin/staffRoutes.js"
import rfidRoutes from "./routes/admin/rfidRoutes.js"
import attendanceRoutes from "./routes/admin/attendanceRoutes.js"
import feeRoutes from "./routes/admin/feeRoutes.js";



import bodyParser from 'body-parser'
    import cors from "cors";
    let corsOptions ={
        origin : true,
        credentials: true,
        exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
        optionsSuccessStatus : 200
    }

    const app =express()
    app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config();
connectDB();

app.get('/',(req,res)=>{
res.send('API is running')
})

app.get("/verifyUser", verifyUser)

app.get('/:action',(req,res)=>{
    let action = req.params.action

    if(action === 'on'){
        serialPort.write("w");
        console.log("lock is closed")
        return res.send('Led light is closed!');
    }

    if(action === 'off'){
        serialPort.write("t");
        console.log("lock is open")
        return res.send('Led light is off!');
    }

    res.send('API is running')
})

app.use('/admin',memberRoutes)
app.use('/admin',staffRoutes)
app.use('/admin',rfidRoutes)
app.use('/admin',attendanceRoutes)
app.use('/admin',feeRoutes)



// notFound();
// errorHandler();

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} port ${PORT}`));
