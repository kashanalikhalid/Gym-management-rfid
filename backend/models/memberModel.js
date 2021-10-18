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
    },
    rfid:{
        type:String,
        required:true
    },
    lastEntry:{
        type:Date,
        default:null
    },
    group:{
        type:Number,
        required:true
    },
    months:{
        type:Number,
        required:true
    },
    training:{
        type:Boolean,
        required:true,
        default:false
    },
    discount:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    trainingFee:{
        type:Number,
        default:0
    }
},{timeStamps:true})


const Member=mongoose.model('Member',memberSchema)

export default Member;
