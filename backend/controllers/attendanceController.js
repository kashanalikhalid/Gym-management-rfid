import Attendance from '../models/attendanceModel.js'
import asyncHandler from "express-async-handler";

const attendanceList=asyncHandler(async(req,res)=>{
    const pageSize=10;
    const page = Number(req.query.page) || 1
    const keyword = req.query.search
        ? {
            date: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {}


    const count= await Attendance.countDocuments({...keyword})
    const members=await Attendance.find({...keyword})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ members, page, pages: Math.ceil(count / pageSize) })
})

export {attendanceList}
