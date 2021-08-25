import express from "express";
import {addStaff, staffList, deleteStaff,getStaff,updateStaff} from "../../controllers/staffController.js";
const router=express.Router();

router.route('/data/addStaff').post(addStaff)
router.route('/staff').get(staffList)
router.route('/data/deletestaff/:id').delete(deleteStaff)
router.route('/staffprofile/:id').get(getStaff)
router.route('/updatestaff/:id').patch(updateStaff)

export default router
