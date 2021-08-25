import mongoose from 'mongoose'

const staffSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cnic:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    joiningDate:{
        type:Date,
        required:true
    },
})

const Staff =mongoose.model('Staff',staffSchema)

export default Staff;
