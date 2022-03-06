import express from "express";

export const logoutRoutes = express.Router();

logoutRoutes.get("/", (req, res) => {
    if (req.session) {
        delete req.session["user"];
    }
    res.redirect("/");
});
