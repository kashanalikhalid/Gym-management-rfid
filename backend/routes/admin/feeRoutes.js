import express from 'express'
import {feeList} from "../../controllers/feeController.js"
const router =express.Router()

router.route('/feehistory').get(feeList)

export default router
