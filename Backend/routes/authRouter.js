import {Router} from "express"
import {authenticateUser, forgotPassword, verifyOtp, updatePassword} from "../services/authService.js"

const router = Router()

router.post("/login", authenticateUser)
router.post('/forgotpassword', forgotPassword)
router.post("/verifyOtp", verifyOtp)
router.post("/updatePassword", updatePassword)

export default router