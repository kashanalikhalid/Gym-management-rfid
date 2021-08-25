import asyncHandler from "express-async-handler";
import Member from '../models/memberModel.js'

const addMember =asyncHandler(async(req,res)=>{
    const data=req.body;
    const member= new Member(data)
    const createdMember=await member.save();
    res.status(201).json(createdMember);

})


const memberList=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    const keyword = req.query.search
        ? {
            name: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {}

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
    res.json({count})
})

const updateMember=asyncHandler(async(req,res)=>{
    const member= await Member.findById(req.params.id)
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

        const updatedMember=await member.save()
    res.json(updatedMember)
    }
    else{
        res.status(404);
        throw new Error('Member not found')
    }
})

export {addMember,memberCount,memberList,getMember,deleteMember,updateMember}
