import asyncHandler from "express-async-handler";
import Member from '../models/memberModel.js'
import SerialPort from 'serialport'
let serialPort = new SerialPort("COM4", { baudRate: 9600 });
import Attendance from '../models/attendanceModel.js'

var clients = []

const feeStatus=(date)=>{
    date= new Date(date)
    let today= new Date()
    return Math.round((today-date)/(1000*60*60*24));
}

function diff_hours(dt2, dt1)
{

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}

const verifyUser=asyncHandler(async(req,res)=>{

    try {
        if (req.query.cnic==0){
            // res.status(200).json({data:"User Not found"})
            console.log("Cnic zero not found")
            clients.forEach(client => client.res.write(`data: ${JSON.stringify({found:false})}\n\n`))
            res.sendStatus(200)
        }
       
        else{
            console.log("User cnic: ", req.query.cnic, "   --  Type: ", req.query.type)
            if (req.query.type=="member") {
                const member = await Member.findOne({cnic:req.query.cnic})
                const returnMember = {...member._doc};
                returnMember.type="member"

                const days = feeStatus(member.feeDate)
                const date = new Date()
                let lastEntry = null
                let hours;

                if (member.lastEntry !== null) {
                    lastEntry = new Date(member.lastEntry);
                    hours = diff_hours(lastEntry, date)
                }

                if (days <= (31*member.months)) {
                    // if (member.lastEntry === null) {
                    //     member.lastEntry = date;
                    //     returnMember.allowed=true;
                    // } else if (date.getDate() !== lastEntry.getDate()) {
                    //     member.lastEntry = date;
                    //     returnMember.allowed=true;
                    // } 
                    // else if (hours > 2) {
                    //     returnMember.allowed=false;
                    //     returnMember.reason="time"
                    // }
                    // else if(hours<=2)
                    // {
                    //     member.lastEntry = date;
                    //     returnMember.allowed=true;
                    // }
                    // else{
                    //     member.lastEntry = date;
                    //     returnMember.allowed=true;
                    //     console.log("last else false")
                    // }
                    member.lastEntry=date
                    returnMember.allowed = true
                    returnMember.found = true
                    if (days>=27){
                        returnMember.warning = true
                    }
                    else{
                        returnMember.warning = false
                    }

                }
                else {
                    returnMember.allowed=false;
                    returnMember.reason="fee"
                    returnMember.found = true


                }
                await member.save();
                console.log(returnMember)
                if (returnMember.allowed){
                    
                    serialPort.write("w");
                    console.log("sending signal")
                }
                clients.forEach(client => client.res.write(`data: ${JSON.stringify(returnMember)}\n\n`))

                

                if ( ((  new Date(lastEntry.toDateString()) < new Date(new Date().toDateString())  ) || (lastEntry==null) )  ){
                    console.log("if running")

                    const attendanceMember= {date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
                        name:member.name,
                        reg:member.id,
                        rfid:member.cnic,
                        time:new Date(new Date().setHours(new Date().getHours() + 5))

                    }
                    console.log("attendance member", attendanceMember)
                    const attendance= new Attendance(attendanceMember) 
                    const createdAttendance =await attendance.save();
                }
                
                res.status(200).json(returnMember);
            }
            else if(req.query.type=="staff"){
                clients.forEach(client => client.res.write(`data: ${JSON.stringify({staff:true})}\n\n`))
                serialPort.write("w");
                console.log("Staff Allowed:true")
                res.status(200).json({allowed:true});
            }
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    
})



const notify=asyncHandler(async(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const clientId = Date.now()
    clients.push({id:clientId, res})

    req.on('close', ()=> {
        clients = clients.filter(client=> client.id!==clientId)
    })

})
export {verifyUser, notify}