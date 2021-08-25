import express from "express";
import {addMember,memberList,deleteMember,getMember,memberCount,updateMember} from '../../controllers/memberController.js'
const router =express.Router()


router.route('/data/addmember').post(addMember)
router.route('/members').get(memberList)
router.route('/data/deletemember/:id').delete(deleteMember)
router.route('/updatemember/:id').patch(updateMember)
router.route('/memberprofile/:id').get(getMember)
export default router
