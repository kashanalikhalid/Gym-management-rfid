import mongoose from 'mongoose'

const feeSchema =mongoose.Schema({
    member:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Member'
    },
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true,
    }
},{timestamps:true})


const Fee=mongoose.model('Fee',feeSchema)

export default Fee;
