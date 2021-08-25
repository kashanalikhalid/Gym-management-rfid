import mongoose from 'mongoose'
const fingerPrintSchema =mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    keypoints:{
        type:String,
        required:true
    },
    descriptors:{
        type:String,
        required:true
    },
    shape:{
        type:String,
        required:true
    }
},{timeStamps:true})

const FingerPrintModel=mongoose.model('fingerPrint',fingerPrintSchema)

export default FingerPrintModel;
