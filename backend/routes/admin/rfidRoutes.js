import express from "express";
import {addRfid,updateRfid,deleteRfid,verifyRfid} from '../../controllers/rfidController.js'
const router =express.Router()

router.route('/data/addrfid').post(addRfid)
router.route('/data/deleterfid/:rfid').delete(deleteRfid)
router.route('/updaterfid/:rfid').patch(updateRfid)
router.route('/verifyrfid/:rfid').get(verifyRfid)


export default router
