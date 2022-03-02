const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const Profile = require("../models/profile")
const PasswordReset = require("../models/passwordreset");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error-handler");
const random = require("randomstring");
const {sendEmail} = require("../utils/mail-sender");

module.exports = {
    register: async(req, res) => {
        const body = req.body;
        try {
            const check = await Users.findOne({
                email: body.email,
            });
            if (check) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Email already exist, please register with different email or login",
                    result: {},
                });
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = new Users({
                name: body.name,
                email: body.email,
                password: hashedPassword,
            });
            const profile = new Profile({userId : user._id})
            user.profileId = profile._id
            await user.save()
            await profile.save()

            const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_KEY, { expiresIn: 60 * 60 * 12 }
            );

            let html = `<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"> </head> <body bgcolor="#FFFFFF" style="padding: 0; margin: 0; width: 100%; font-family: 'Helvetica', 'Arial', san-serif; max-width: 100%; "><span style="color:transparent;visibility:hidden;display:none;opacity:0;height:0;width:0;font-size:0;">Welcome to Whiteboard!!</span><!--[if mso]><style type=”text/css”>body{font-family:Arial,sans-serif}ul,li{list-style:none;list-style-type:none;padding:0}</style><![endif]--> <table bgcolor="" style="font-family:'Helvetica','Arial',san-serif; margin:0; max-width:100%; padding:0; width:100%"> <tbody> <tr> <td> <center>&nbsp; <table style="margin:10px auto; max-width:100%; width:600" class="preheader"> <tbody><tr> <td style="text-align:center"> <center><a href="#"><img height="36" width="128" alt="" style="display: block; margin:20px auto 0;" src="https://res.cloudinary.com/insieg/image/upload/v1646127652/Logo_khe3qq.png"/></a></center> </td> </tr> </tbody> </table> <table style="margin:0 auto; max-width:100%; width:600px" class="email-wrap"> <tbody> <tr> <td><!-- CONTENT --> <style type="text/css">.content p{color:#444;font-size:18px;line-height:24px}</style> <table bgcolor="white" border="0" cellpadding="0" cellspacing="0" style="background:white; border-radius:8px; border:0; margin:0px auto; width:100%" class="content"> <tbody> <tr> <td> <table border="0" cellpadding="30" cellspacing="0"> <tbody> <tr> <td style="color:#444444; font-size:18px; line-height:24px"> <center> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Hey ${body.name}, </font></p> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Welcome to Whiteboard. We're thrille to see you here! We're confident that Whiteboard will help you to collaborate and manage your projects more easy and comfortably wheter with your team or your own.</font></p> <center> <table border="0" cellpadding="14" cellspacing="0" style="background:#0079bf; border-radius:6px; color:#ffffff; cursor:pointer; display:inline-block; font-size:20px; font-weight:bold; line-height:24px; margin:5px auto; text-align:center" class="button main"> <tbody> <tr> <td align="center" style="vertical-align:middle" class="emailButtonContent"><font color="#444444"><a target="_blank" style="text-decoration:none; padding: 0 8px;" href="https://whiteboard-product.herokuapp.com/api/v1/auth/register"><font color="white">Go To My Boards →</font></a></font></td> </tr> </tbody> </table> </center> <p style="text-align: left; line-height: 22px; font-size: 16px;"><font color="#444444">Thanks! We're excited to have you on our app,<br/> Whiteboard Team</font></p> </center> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table>  <!-- FOOTER --> <table border="0" cellpadding="0" cellspacing="12" style="border:0; font-size:14px; line-height:20px; max-width:100%; width:100%"> <tbody> <tr> <td> <center><font color="#777777"><em>Copyright © 2022 Whiteboard, All rights reserved.</em></font></center> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> </body> </html>`

            await sendEmail(
                body.email,
                'Welcome To Whiteboard!',
                html
            )

            res.status(201).json({
                status: "Created",
                message: "Registered successfuly",
                result: user,
                token : token,
                profile : profile
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    login: async(req, res) => {
        const { email, password } = req.body;
        try {
            const user = await Users.findOne({
                email: email,
            });
            if (!user) {
                return res.status(401).json({
                    status: "Unauthorized",
                    message: "Invalid email or password",
                    result: {},
                });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({
                    status: "Unauthorized",
                    message: "Invalid email or password",
                    result: {},
                });
            }
            const token = jwt.sign({ email: user.email, id: user.id },
                process.env.JWT_KEY, {
                    expiresIn: "12h",
                }
            );

            res.status(200).json({
                status: "OK",
                message: "Logged in successfuly",
                result: {
                    token,
                },
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    forgotPassword: async(req, res) => {
        const { email } = req.body;
        try {
            const user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Invalid email, user with that email is not found",
                    result: {},
                });
            }
            const passwordReset = await PasswordReset.create({
                email,
                validationCode: random.generate(50),
                isDone: false,
            });
            sendMail(
                email,
                "Password Reset",
                `
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://laptop-app.com" title="logo" target="_blank">
                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="https://localhost:5000/api/v1/auth/forgot?code=${passwordReset.validationCode}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.laptop-app.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>   `
            );

            res.status(200).json({
                status: "success",
                message: "We've sent you an email to confirm your password reset",
                result: {},
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    resetPassword: async(req, res) => {
        const { validationCode, password } = req.body;
        try {
            const schema = Joi.object({
                password: Joi.string().min(6).required(),
                validationCode: Joi.string().required,
            });
            const { error } = schema.validate();
            if (error) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: error.message,
                    result: {},
                });
            }
            const validate = await PasswordReset.findOne({
                validationCode,
                isDone: false,
            });
            if (!validate) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Invalid validation code confirmation",
                    result: {},
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await Users.updateOne({ email: validate.email }, { password: hashedPassword });

            await PasswordReset.updateOne({ isDone: true }, { validationCode: validationCode });

            res.status(200).json({
                status: "success",
                message: "Successfuly change the password",
                result: {},
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    googleCallback: async(req, res) => {
        const profile = req.user._json;
        let user;
        try {
            user = await Users.findOne({ email: profile.email });
            if (!user) {
                user = await Users.create({
                    email: profile.email,
                    name: profile.name,
                    password: "",
                });
            }
            const token = jwt.sign({ email: user.email, id: user._id },
                process.env.JWT_KEY
            );
            res.cookie("token", token);
            res.redirect("/");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    facebookCallback: async(req, res) => {
        const profile = req.user._json;
        let user;
        try {
            user = await Users.findOne({ email: profile.email });
            if (!user) {
                user = await Users.create({
                    email: profile.email,
                    name: profile.name,
                    password: "",
                });
            }
            const token = jwt.sign({ email: user.email, id: user._id },
                process.env.JWT_KEY
            );
            res.cookie("token", token);
            res.redirect("/");
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    },
};