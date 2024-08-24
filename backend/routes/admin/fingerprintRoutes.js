import express from "express";
import {verifyUser} from '../../controllers/fingerprintController.js'
const router =express.Router()

router.route('/').get(verifyUser)

export default router