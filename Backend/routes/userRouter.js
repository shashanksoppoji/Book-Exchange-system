import {Router} from "express"
import {createUser} from "../services/UserService.js"

const router = Router()

router.post("/create", createUser)

export default router