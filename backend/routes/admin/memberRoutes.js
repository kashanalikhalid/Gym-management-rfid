import express from "express";
import {
    addMember,
    memberList,
    deleteMember,
    getMember,
    memberCount,
    updateMember,
    addAttendance,
    memberTraining,
    memberWeight,
    memberCardio,
    memberCardioWeight,
    allMembers
} from '../../controllers/memberController.js'
const router =express.Router()


router.route('/data/addmember').post(addMember)
router.route('/members').get(memberList)
router.route('/training').get(memberTraining)
router.route('/weight').get(memberWeight)
router.route('/cardio').get(memberCardio)
router.route('/strengthcardio').get(memberCardioWeight)
router.route('/data/deletemember/:id').delete(deleteMember)
router.route('/updatemember/:id').patch(updateMember)
router.route('/memberprofile/:id').get(getMember)
router.route('/attendance').post(addAttendance)
router.route('/membercount').get(memberCount)
router.route('/allmembers').get(allMembers)
export default router
