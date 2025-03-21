const nodeMailer = require('nodemailer');
require('dotenv').config();

const transpoeter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


module.exports = transpoeter;