import asyncHandler from "express-async-handler";
import Fee from '../models/feeModel.js'
import Member from "../models/memberModel.js";
import { getMonth, getYear, format } from "date-fns";


const feeMonthly = asyncHandler(async(req,res)=>{
    const selectedDate = new Date(req.query.date)

    var firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    var lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    const fees = await Fee.find({createdAt: {$gte: firstDay, $lte: lastDay}})
    let total = 0
    fees.forEach((fee)=>{
        total = total + fee.amount
    })

    res.status(200).json({rev:total})
})


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
    .sort( {$natural:-1})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({ fees, page, pages: Math.ceil(count / pageSize) })
})

export {feeList, feeMonthly}
