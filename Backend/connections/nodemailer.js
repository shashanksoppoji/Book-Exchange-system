import { createTransport } from "nodemailer";

const emailTransporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'bookexhangesystem@gmail.com',
        pass: 'vztv ipla suvo cnzt'
    }
});

export default emailTransporter