import express from "express";
import {addFingerprint, deleteFingerprint, verifyFingerprint} from '../../controllers/fingerprintController.js'
const router=express.Router()

router.route('/addfingerprint').post(addFingerprint);
router.route('/deletefingerprint/:id').delete(deleteFingerprint)
router.route('/verifyfingerprint').post(verifyFingerprint)


export default router
