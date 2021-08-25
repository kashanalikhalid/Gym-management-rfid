import asyncHandler from "express-async-handler";
import FingerPrintModel from "../models/fingerprintModel.js";
import Member from '../models/memberModel.js'
import mongoose from "mongoose";
import {PythonShell} from "python-shell";

const addFingerprint= asyncHandler(async(req,res)=>{
    const data= req.body

    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: '/app/backend/scripts',
    };
   let shell = new PythonShell("/descriptors.py",options)

    console.log("python shell initiated")
    shell.send("hello");
    console.log("data sent")

    shell.on('message', async function (message) {
        console.log("message from python shell ")
        // const arr=message.split('*')
        // data["keypoints"]=arr[0]
        // data["descriptors"]=arr[1];
        // data["shape"]=arr[2];
        // const fingerprint=new FingerPrintModel(data)
        // const createdFingerprint=await fingerprint.save();
        // res.status(201).json(createdFingerprint)
        console.log(message)
    });

    shell.end(function (err,code,signal) {
        console.log("shell ended")
        if (err) console.log(err);
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
    });



})


const deleteFingerprint=asyncHandler(async(req,res)=>{
    const fingerprint=await FingerPrintModel.findOne({id:mongoose.Types.ObjectId(req.params.id)})
    if(fingerprint)
    {
        await fingerprint.remove();
        res.json({message:"fingerprint deleted"})
    }
    else{
        res.status(404)
        throw new Error('Fingerprint not found')
    }

})

const verifyFingerprint=asyncHandler(async(req,res)=>{
    let data= req.body
    let matchingData=[]
    let match={
        number:99999,
        id:null
    }
    let options = {
        mode: 'text',
        scriptPath: '../scripts',
        pythonPath:process.env.PYTHONPATH
    };

    let descriptorShell = new PythonShell("descriptors.py",options)

    descriptorShell.send(data.fingerprint)

    descriptorShell.on('message',  function (message) {
        const arr=message.split('*')
        matchingData[0]=arr[0]
        matchingData[1]=arr[1]
        matchingData[2]=arr[2]
        matchingData[3]=data.fingerprint
    })

    let count=await FingerPrintModel.countDocuments({})
    descriptorShell.end(async function (err,code,signal) {

         await FingerPrintModel.find({}, (err,fingerprints) =>{
            if(fingerprints) {
               fingerprints.map((fingerprint,index) => {
                    let verifyShell=new PythonShell("verify.py",options)
                    matchingData[4] = fingerprint.keypoints
                    matchingData[5] = fingerprint.descriptors
                    matchingData[6] = fingerprint.shape
                    matchingData[7] = fingerprint.image;
                    verifyShell.send(`${matchingData[0]}*${matchingData[1]}*${matchingData[2]}*${matchingData[3]}*${matchingData[4]}*${matchingData[5]}*${matchingData[6]}*${matchingData[7]}`)
                    verifyShell.on('message', async function (message) {
                        let matched=parseFloat(message).toFixed(3)
                        console.log(matched)
                        console.log(fingerprint.id)
                        if(matched<match.number)
                        {
                            match["number"]=matched;
                            match["id"]=fingerprint.id
                        }
                        if(index===(count-1))
                        {
                            const member=await Member.findById(match.id)
                            console.log(member.name)
                        }
                    })
                    verifyShell.end(function (err, code, signal) {
                        if (err) throw err;
                        // console.log("message from verify shell")
                        // console.log('The exit code was: ' + code);
                        // console.log('The exit signal was: ' + signal);
                        console.log('finished');
                    });
                })
            }


        })

        if (err) {
            // res.status(404)
            // throw new Error('Fingerprint not found')
            throw err;
        }
        console.log("message from descriptor shell")
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');

    });

})

export{addFingerprint,deleteFingerprint,verifyFingerprint}
