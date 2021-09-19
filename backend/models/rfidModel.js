import mongoose from 'mongoose'
const rfidSchema=mongoose.Schema({
    rfid:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true
    }
})

const Rfid=mongoose.model('Rfid',rfidSchema)
export default Rfid;
