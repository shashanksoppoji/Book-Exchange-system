import { hashSync } from "bcrypt"
import userModel from "../models/UserModel.js"
import { generateToken } from "../connections/jwt.js"
import { compareSync } from 'bcrypt'
import { sendOtp } from "../utils/sendOtp.js"


export const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email }).exec()
        if (!user) return res.status(404).json({ message: "No user found" })

        const isPasswordVerified = compareSync(password, user.password)
        if (!isPasswordVerified) return res.status(401).json({ message: "Wrong password" })

        const token = await generateToken(user)

        // Remove sensitive data before sending
        const userWithoutSensitiveData = user.toObject()
        delete userWithoutSensitiveData.password
        delete userWithoutSensitiveData.otp

        return res.status(200).json({ 
            token,
            user: userWithoutSensitiveData
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')

        const user = await userModel.findOne({ email }).exec()
        if (!user) return res.send("User not found")
        user.otp = otp
        await user.save()

        await sendOtp(email, otp)

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const verifyOtp = async (req, res) => {
    const { otp, email } = req.body
    try {

        const user = await userModel.findOne({ email }).exec()
        if (!user) return res.send("User not found")

        const isOtpVerified = user.otp == otp
        if (isOtpVerified) res.send("OTP Verified")

        else res.send("Invalid OTP")
    } catch (e) {
        throw new Error(e)
    }
}

export const updatePassword = async (req, res) => {
    const { email, password } = req.body

    try {

        const user = await userModel.findOne({ email }).exec()
        if (!user) return res.send("user not found")

        user.password = hashSync(password, 10)
        await user.save()

        res.send("Password Updated")
    }
    catch (e) {
        throw new Error(e)
    }
}