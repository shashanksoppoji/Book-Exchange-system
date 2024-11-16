import userModel from "../models/UserModel.js"
import { hashSync } from "bcrypt"

export async function createUser(req, res) {
    try {
        var { firstName, lastName, email, password } = req.body
        const createdUser = new userModel({ firstName, lastName, email, password: hashSync(password, 10) })
        await createdUser.save()
        return res.send(createdUser)
    }
    catch (err) {
        console.log(err)
        return res.send("something went wrong")
    }
}