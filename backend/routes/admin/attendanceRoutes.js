import express from "express";
import {attendanceList} from '../../controllers/attendanceController.js'
const router =express.Router()

router.route('/attendance').get(attendanceList)

export default router
