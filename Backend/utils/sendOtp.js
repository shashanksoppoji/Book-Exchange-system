import transporter from "../connections/nodemailer.js"

export const sendOtp = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: 'bookexhangesystem@gmail.com',
            to: email,
            subject: 'Hello from Nodemailer',
            text: `Use ${otp} for to Verify the OTP`
        });


        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}