import asyncHandler from "express-async-handler";
import Member from '../models/memberModel.js'
import Attendance from '../models/attendanceModel.js'
import Fee from '../models/feeModel.js'

const getFormattedDate=(date)=>{
    let newDate=new Date(date)
    return `${newDate.getDate()}-${newDate.getMonth()+1}-${newDate.getFullYear()}`

}

const addMember =asyncHandler(async(req,res)=>{
    let data=req.body;
    let member= new Member(data)
    member=await member.save();

    const savedMember = await Member.findOne({cnic: {$eq: data.cnic}})
    let feedata = {
        member: savedMember._id,
        name: savedMember.name,
        amount: savedMember.fee,
        date: getFormattedDate(savedMember.feeDate)
    }
    let fee = await new Fee(feedata)
    fee = await fee.save()
    res.status(201).json(member);

})

const updateMember=asyncHandler(async(req,res)=>{
    const member= await Member.findById(req.params.id)
    console.log(getFormattedDate(req.body.feeDate))
    console.log(getFormattedDate(member.feeDate))

    if(req.body.feeDate)
    {
        if(getFormattedDate(member.feeDate)!=getFormattedDate(req.params.feeDate))
        {
            let data={
            member:member._id,
            name:member.name,
            amount:req.body.fee||member.fee,
            date:getFormattedDate(req.body.feeDate),
        }
            let fee=await new Fee(data)
            fee= await fee.save()
        }
    }
    if(member)
    {
        member.contact=req.body.contact||member.contact
        member.name=req.body.name||member.name
        member.city=req.body.city||member.city
        member.address=req.body.address||member.address
        member.cnic=req.body.cnic||member.cnic
        member.registrationDate=req.body.registrationDate||member.registrationDate
        member.fee=req.body.fee||member.fee
        member.feeDate=req.body.feeDate||member.feeDate
        member.registration=req.body.registration||member.registration
        member.membership=req.body.membership||member.membership
        member.rfid=req.body.rfid || member.rfid
        member.months=req.body.months||member.months
        member.group=req.body.group||member.group
        member.training=req.body.training
        member.discount=req.body.discount
        member.trainingFee=req.body.trainingFee||member.trainingFee

        const updatedMember=await member.save()
    res.json(updatedMember)
    }
    else{
        res.status(404);
        throw new Error('Member not found')
    }
})


const memberList=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    let keyword
    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
            ? {
                $or:[
                    {name:{$regex:req.query.search,$options:'i'}},
                ]
            }
            : {}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}

                ]
            }
            : {}
    }


    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})

const memberTraining=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1

    let keyword

    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
        ? {
            $or:[
                {name:{$regex:req.query.search,$options:'i'}},
            ],
            training:true,
        }
        : {training:true}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}
                ],
                training:true,
            }
            : {training:true}
    }




    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})


const femaleMembers=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    let keyword
    console.log(req.query.search)
    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
            ? {
                $or:[
                    {name:{$regex:req.query.search,$options:'i'}},
                ],
                gender:"female"
            }
            : {gender:"female"}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}
                ],
                gender:"female",
            }
            : {gender:"female"}
    }


    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})



const memberCardio=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    let keyword
    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
            ? {
                $or:[
                    {name:{$regex:req.query.search,$options:'i'}},
                ],
                training:true,
            }
            : {membership:"Cardio"}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}
                ],
                membership:"Cardio",
            }
            : {membership:"Cardio"}
    }


    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})


const memberWeight=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    let keyword
    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
            ? {
                $or:[
                    {name:{$regex:req.query.search,$options:'i'}},
                ],
                training:true,
            }
            : { membership:"Weight Training"}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}
                ],
                membership:"Weight Training",
            }
            : { membership:"Weight Training"}
    }


    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})


const memberCardioWeight=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1

    let keyword
    if(isNaN(parseInt(req.query.search)))
    {
        keyword = req.query.search
            ? {
                $or:[
                    {name:{$regex:req.query.search,$options:'i'}},
                ],
                training:true,
            }
            : { membership:"Cardio and weight Training"}
    }
    else{
        keyword = req.query.search
            ? {
                $or:[
                    {rfid:{$regex:req.query.search,$options:'i'}},
                    {contact:parseInt(req.query.search)}
                ],
                membership:"Cardio and weight Training",
            }
            : {membership:"Cardio and weight Training"}
    }

    const count= await Member.countDocuments({...keyword})
    const members=await Member.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})




const deleteMember=asyncHandler(async(req,res)=>{
    const member=await Member.findById(req.params.id)
    if(member)
    {
        await member.remove()
        res.json({message:'Member removed'})
    }else{
        res.status(404)
        throw new Error('Member not found')
    }
})

const getMember=asyncHandler(async(req,res)=>{
    const id=req.params.id
    const member= await Member.findById(id);

    if(member)
    {
        res.json(member)
    }else{
        res.status(404);
        throw new Error('Member Not found')
    }
})



const memberCount=asyncHandler (async(req,res)=>{
    const count= await Member.countDocuments({})
    const training= await Member.countDocuments({training:true})
    const cardio= await Member.countDocuments({membership:"Cardio"})
    const strength= await Member.countDocuments({membership:"Weight Training"})
    const strengthCardio= await Member.countDocuments({membership:"Cardio and weight Training"})
    res.json({count,training,cardio,strength,strengthCardio})
})



const addAttendance =asyncHandler(async(req,res)=>{
    const data=req.body;
    const attendance= new Attendance(data)
    const createdAttendance =await attendance.save();
    res.status(201).json(createdAttendance);

})


const allMembers =asyncHandler(async(req,res)=>{
    const members=await Member.find({})
    res.status(201).json(members);

})




export {addMember,memberCount,memberList,getMember,deleteMember,updateMember,addAttendance,memberTraining,memberCardio,memberWeight,memberCardioWeight,allMembers,femaleMembers}
