import mongoose from 'mongoose'

const memberSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cnic:{
        type:Number,
        required:true,
        unique:true
    },
    contact:{
        type:Number,
        required:true
    },
    registration:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true,
    },
    feeDate:{
        type:Date,
        required:true
    },
    membership:{
        type:String,
        required:true
    },
    registrationDate:{
        type:Date,
        required:true
    },
    address:{
        type:String,
        required:true
    }
},{timeStamps:true})


const Member=mongoose.model('Member',memberSchema)

export default Member;
