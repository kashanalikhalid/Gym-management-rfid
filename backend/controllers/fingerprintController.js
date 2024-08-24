import asyncHandler from "express-async-handler";
import Member from '../models/memberModel.js'
import SerialPort from 'serialport'
let serialPort = new SerialPort("COM4", { baudRate: 9600 });


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
                let lastEntry;
                let hours;

                if (member.lastEntry !== null) {
                    lastEntry = new Date(member.lastEntry);
                    hours = diff_hours(lastEntry, date)
                }

                if (days <= (31*member.months)) {
                    if (member.lastEntry === null) {
                        member.lastEntry = date;
                        returnMember.allowed=true;
                    } else if (date.getDate() !== lastEntry.getDate()) {
                        member.lastEntry = date;
                        returnMember.allowed=true;
                    } 
                    // else if (hours > 2) {
                    //     returnMember.allowed=false;
                    //     returnMember.reason="time"
                    // }
                    // else if(hours<=2)
                    // {
                    //     member.lastEntry = date;
                    //     returnMember.allowed=true;
                    // }
                    else{
                        member.lastEntry = date;
                        returnMember.allowed=false;
                        console.log("last else false")
                    }
                }
                else {
                    returnMember.allowed=false;
                    returnMember.reason="fee"


                }
                await member.save();
                console.log(returnMember)
                res.status(200).json(returnMember);
            }
            else if(req.query.type=="staff"){
                console.log("Staff Allowed:true")
                res.status(200).json({allowed:true});
            }
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    
})

export {verifyUser}