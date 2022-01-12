import asyncHandler from "express-async-handler";
import Fee from '../models/feeModel.js'
import Member from "../models/memberModel.js";



const feeList=asyncHandler(async(req,res)=>{
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

    const count= await Fee.countDocuments({...keyword})
    const fees=await Fee.find({...keyword})
    .sort( { 'timestamp': -1 } )
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ fees, page, pages: Math.ceil(count / pageSize) })
})

export {feeList}
