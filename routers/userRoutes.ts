import express from "express";
import { client } from "../app";
import tables from "../tables";
import { hashPassword } from "../hash";
import path from "path";
import multer from "multer";

export const userRoutes = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
        );
    },
});

const upload = multer({ storage });

userRoutes.get("/", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT id, name, email, birth_date, gender, occupation, budget, profile_img, description, rating FROM ${tables.USERS}`
    );
    const users = queryResult.rows;
    res.json({ users }).end();
});

userRoutes.get("/loggingIn", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT id, name, email, birth_date, gender, occupation, budget, profile_img, description, rating FROM ${tables.USERS} WHERE id = $1`,
        [req.session["user"].id]
    );
    const user = queryResult.rows[0];
    res.json({ user }).end();
});

userRoutes.get("/profile", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const queryResult = await client.query(
        /*sql*/ `SELECT id, name, email, birth_date, gender, occupation, budget, profile_img, description, rating FROM ${tables.USERS} WHERE id = $1`,
        [req.session["user"].id]
    );
    const user = queryResult.rows[0];
    res.json({ user }).end();
});

userRoutes.get("/:id", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.USERS} WHERE id = $1`,
        [req.params.id]
    );
    const user = queryResult.rows[0];
    res.status(200).json({ user }).end();
});

userRoutes.post("/", upload.single("image"), async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = await hashPassword(password);
        const name = req.body.name;
        const birthDate = req.body.birthDate;
        const gender = req.body.gender;
        const occupation = req.body.occupation;
        const budget = req.body.budget;
        const description = req.body.description;
        const image = req.file?.filename;

        const result = (
            await client.query(
                /*sql*/ `SELECT email FROM users WHERE email = $1`,
                [email]
            )
        ).rows[0];

        if (result) {
            res.status(400).json({ message: "This email has been taken" });
            return;
        }

        const queryResult = await client.query(
            /*sql*/ `INSERT INTO ${tables.USERS} (name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, email;`,
            [
                name,
                email,
                // password,
                hashedPassword,
                birthDate,
                gender,
                occupation,
                budget,
                image,
                description,
                new Date(),
                new Date(),
            ]
        );

        const userData = queryResult.rows[0];
        const userID = userData.id;
        const userEmail = userData.email;

        req.session["user"] = {
            id: userID,
            email: userEmail,
        };

        res.status(200).json({ message: "Success signup" }).end();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});
