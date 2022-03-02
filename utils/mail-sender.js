const nodemailer = require("nodemailer");

exports.sendEmail = async(to, subject, html) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });


        let info = await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to,
            subject,
            html: html
        });

        console.log('Message sent: %s', info.messageId)

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    } catch (error) {
        console.log(error);
    }
}