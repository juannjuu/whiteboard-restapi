app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/");
    }
);