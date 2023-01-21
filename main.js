const nodemailer = require('nodemailer');
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '.env')
})

// Nodemailer connection info
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.nodemailerEmail,
        pass: process.env.nodemailerPass
    }
});

// Email data
mailOptions = {
    from: process.env.nodemailerEmail,
    to: 'padmanathantom@gmail.com',
    subject: `${'USERNAME'} just got banned by ${'HELPER'}`,
    html: `<h1>${'USERNAME'} just got banned by ${'HELPER'}</h1>
    <table style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
        <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Staff</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">User</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Time</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Reason</td>
        </tr>
        <tr style="border: 1px solid black; border-collapse: collapse; padding: 10px;">
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'HELPER'}</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'USER'}</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${new Date().toJSON().slice(0, 19).replace('T', ' ')}</td>
            <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${'REASON'}</td>
        </tr>
    </table>`
};

// Send verification email
transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    else console.log('Verification email sent: ' + info.response);
});