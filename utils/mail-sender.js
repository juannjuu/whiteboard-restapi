const nodemailer = require("nodemailer");

module.exports = async(email, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SMTP,
                pass: process.env.PASSWORD_EMAIL,
            },
        });
        let info = await transporter.sendMail({
            from: '"Whiteboard" <no-reply@whiteboard-app.com>',
            to: email,
            subject: subject,
            text: "",
            html: content,
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log(error);
    }
};