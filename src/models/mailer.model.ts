import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.SENMAILER_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export default (transport);