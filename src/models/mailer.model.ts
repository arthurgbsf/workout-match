import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

var transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.SENMAILER_PORT),
    secure: false,
    logger: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    
    tls:{
        rejectUnauthorized: true
    }
});

export default transport ;