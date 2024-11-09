import express from 'express'
import {feeList, feeMonthly} from "../../controllers/feeController.js"
const router =express.Router()

router.route('/feehistory').get(feeList)
router.route('/feemonthly').get(feeMonthly)

export default router
