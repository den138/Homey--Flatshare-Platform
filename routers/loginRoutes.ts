import express from "express";
import { client } from "../app";
import { checkPassword } from "../hash";

export const loginRoutes = express.Router();

loginRoutes.post("/", async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const userResult = await client.query(
            /*sql*/ `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error();
        }

        const match = await checkPassword(password, user.password);

        if (!match) {
            throw new Error();
        }

        req.session["user"] = {
            id: user.id,
            email: user.email,
        };

        res.status(200).json({ message: "Success login" }).end();
    } catch (error) {
        res.status(400).json({ message: "Invalid email or password" }).end();
    }
});
