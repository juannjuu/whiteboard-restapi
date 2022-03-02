const nodemailer = require("nodemailer");

module.exports = {
    sendEmail : async(email, subject, content) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS,
                },
            });
            let info = await transporter.sendMail({
                from: '"Whiteboard" <no-reply@whiteboard-app.com>',
                to: email,
                subject: subject,
                html: content,
            });
    
            console.log("Message sent: %s", info.messageId);
    
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.log(error);
        }
    }
}