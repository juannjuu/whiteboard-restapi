const nodemailer = require("nodemailer");

exports.sendEmail = async(to, subject, name) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        let html = `<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"> </head> <body bgcolor="#FFFFFF" style="padding: 0; margin: 0; width: 100%; font-family: 'Helvetica', 'Arial', san-serif; max-width: 100%; "><span style="color:transparent;visibility:hidden;display:none;opacity:0;height:0;width:0;font-size:0;">Welcome to Whiteboard!!</span><!--[if mso]><style type=”text/css”>body{font-family:Arial,sans-serif}ul,li{list-style:none;list-style-type:none;padding:0}</style><![endif]--> <table bgcolor="" style="font-family:'Helvetica','Arial',san-serif; margin:0; max-width:100%; padding:0; width:100%"> <tbody> <tr> <td> <center>&nbsp; <table style="margin:10px auto; max-width:100%; width:600" class="preheader"> <tbody><tr> <td style="text-align:center"> <center><a href="#"><img height="36" width="128" alt="" style="display: block; margin:20px auto 0;" src="https://res.cloudinary.com/insieg/image/upload/v1646127652/Logo_khe3qq.png"/></a></center> </td> </tr> </tbody> </table> <table style="margin:0 auto; max-width:100%; width:600px" class="email-wrap"> <tbody> <tr> <td><!-- CONTENT --> <style type="text/css">.content p{color:#444;font-size:18px;line-height:24px}</style> <table bgcolor="white" border="0" cellpadding="0" cellspacing="0" style="background:white; border-radius:8px; border:0; margin:0px auto; width:100%" class="content"> <tbody> <tr> <td> <table border="0" cellpadding="30" cellspacing="0"> <tbody> <tr> <td style="color:#444444; font-size:18px; line-height:24px"> <center> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Hey ${name}, </font></p> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Welcome to Whiteboard. We're thrille to see you here! We're confident that Whiteboard will help you to collaborate and manage your projects more easy and comfortably wheter with your team or your own.</font></p> <center> <table border="0" cellpadding="14" cellspacing="0" style="background:#0079bf; border-radius:6px; color:#ffffff; cursor:pointer; display:inline-block; font-size:20px; font-weight:bold; line-height:24px; margin:5px auto; text-align:center" class="button main"> <tbody> <tr> <td align="center" style="vertical-align:middle" class="emailButtonContent"><font color="#444444"><a target="_blank" style="text-decoration:none; padding: 0 8px;" href="https://whiteboard-product.herokuapp.com/api/v1/auth/register"><font color="white">Go To My Boards →</font></a></font></td> </tr> </tbody> </table> </center> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Thanks! We're excited to have you on our app,<br/> Whiteboard Team</font></p> </center> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>  <!-- FOOTER --> <table border="0" cellpadding="0" cellspacing="12" style="border:0; font-size:14px; line-height:20px; max-width:100%; width:100%"> <tbody> <tr> <td> <center><font color="#777777"><em>Copyright © 2022 Whiteboard, All rights reserved.</em></font></center> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> </body> </html>`

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