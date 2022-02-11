require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/index");
const port = 5000;
const connect = require("./config/db");
const passport = require("./config/passport");

connect();

app.use(router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        status: "Whiteboard app is running good",
        time: new Date().toLocaleString(),
    });
});

app.use("/api/v1", router);
app.get(
    "/api/v1/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/v1/auth/google" }),
    (req, res) => {
        console.log(req.user);
        res.redirect("/user");
    }
);

app.listen(port, () => {
    console.log(`Server Listen on Port: ${port}`);
});