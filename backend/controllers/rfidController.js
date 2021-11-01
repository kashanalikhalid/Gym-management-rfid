import asyncHandler from "express-async-handler";
import Rfid from '../models/rfidModel.js'
import Member from '../models/memberModel.js'


const addRfid =asyncHandler(async(req,res)=>{
    const data=req.body;
    const rfid= new Rfid(data)
    const createdMember=await rfid.save();
    res.status(201).json(createdMember);

})


const deleteRfid=asyncHandler(async(req,res)=>{
    let rfid= await Rfid.findOne({rfid:req.params.rfid})
    if(rfid)
    {
        await rfid.remove()
        res.json({message:'Rfid removed'})
    }else{
        res.status(404)
        throw new Error('Rfid not found')
    }
})


const updateRfid=asyncHandler(async(req,res)=>{
    let rfid= await Rfid.findOne({rfid:req.params.rfid})
    if(rfid)
    {
        rfid.rfid=req.body.rfid||rfid.rfid

        const updatedRfid=await rfid.save()
        res.json(updatedRfid)
    }
    else{
        res.status(404);
        throw new Error('Member not found')
    }
})

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

const verifyRfid =asyncHandler(async(req,res)=>{
    let rfid= await Rfid.findOne({rfid:req.params.rfid})
    if(rfid) {
        console.log(rfid)
        if (rfid.type === "member") {
            const member = await Member.findOne({rfid:req.params.rfid})
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
                } else if (hours > 2) {
                    returnMember.allowed=false;
                    returnMember.reason="time"
                }
                else if(hours<=2)
                {
                    member.lastEntry = date;
                    returnMember.allowed=true;
                }
                else{
                    member.lastEntry = date;
                    returnMember.allowed=false;
                }
            }
            else {
                returnMember.allowed=false;
                returnMember.reason="fee"


            }
            await member.save();
            res.json(returnMember);

        }
        else if(rfid.type==="staff")
        {
            res.json({type:"staff",allowed:true})
        }
    }
    else {
        res.status(404)
        throw new Error("rfid not found")
    }
})

export {updateRfid,addRfid,deleteRfid,verifyRfid}
