import asyncHandler from "express-async-handler";
import Staff from '../models/staffModel.js'

const addStaff =asyncHandler(async(req,res)=>{
    const data=req.body;
    const staff= new Staff(data)
    const createdStaff=await staff.save();
    res.status(201).json(createdStaff);

})


const staffList=asyncHandler(async(req,res)=>{
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

    const count= await Staff.countDocuments({...keyword})
    const staff=await Staff.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ staff, page, pages: Math.ceil(count / pageSize) })
})



const deleteStaff=asyncHandler(async(req,res)=>{
    const staff=await Staff.findById(req.params.id)
    if(staff)
    {
        await staff.remove()
        res.json({message:'Staff removed'})
    }else{
        res.status(404)
        throw new Error('Staff not found')
    }
})

const getStaff=asyncHandler(async(req,res)=>{
    const id=req.params.id
    const staff= await Staff.findById(id);

    if(staff)
    {
        res.json(staff)
    }else{
        res.status(404);
        throw new Error('Staff Not found')
    }
})



const staffCount=asyncHandler (async(req,res)=>{
    const count= await Staff.countDocuments({})
    res.json({count})
})

const updateStaff=asyncHandler(async(req,res)=>{
    const staff=await Staff.findById(req.params.id)
    if(staff)
    {
        staff.name=req.body.name || staff.name
        staff.phone=req.body.phone || staff.phone
        staff.cnic=req.body.cnic || staff.cnic
        staff.address=req.body.address || staff.address
        staff.joiningDate=req.body.joiningDate || staff.joiningDate
        staff.city=req.body.city||staff.city
        staff.rfid=req.body.rfid || staff.rfid

        const updatedStaff=await staff.save()
        res.json(updatedStaff)
    }
    else{
        res.status(404)
        throw new Error("Staff not found")
    }

})




export {addStaff,staffCount,staffList,getStaff,deleteStaff,updateStaff}
