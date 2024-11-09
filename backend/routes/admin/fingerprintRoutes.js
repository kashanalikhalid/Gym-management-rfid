import express from "express";
import {verifyUser, notify} from '../../controllers/fingerprintController.js'
const router =express.Router()

router.route('/').get(verifyUser)
router.route('/').get(notify)

export default router