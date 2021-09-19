import mongoose from 'mongoose'

const attendanceSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    reg:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'Member',
        required:true
    },
    date:{
        type:String,
        required:true,
    },
    rfid:{
        type:String,
        required:true,
    },
    time:{
        type:Date,
        required:true
    }
})

attendanceSchema.index({ 'rfid': 1, 'date': 1}, { unique: true });

const Attendance=mongoose.model('Attendance',attendanceSchema)

export default Attendance;
