require('dotenv').config(); // Load environment variables from .env file
const nodeMailer = require('nodemailer');

process.env.SMTP_SERVICE="gmail"

process.env.SMTP_USER="lg58ravi1708@gmail.com"

process.env.SMTP_PASSWORD="Lucky@123"

// process.env.SMTP_HOST="smtp.gmail.com"

// process.env.SMTP_PORT=587

// console.log(`SMTP_SERVICE: ${process.env.SMTP_SERVICE}`);
// console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
// console.log(`SMTP_PASSWORD: ${process.env.SMTP_PASSWORD}`);
// console.log(process.env);

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({

        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,

        service: process.env.SMTP_SERVICE,
        // print this to console to check if the service is working
      
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    console.log(`mailOptions: ${mailOptions}`);
    console.log(`email: ${options.email}`);
    console.log(`subject: ${options.subject}`);
    console.log(`message: ${options.message}`);
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;