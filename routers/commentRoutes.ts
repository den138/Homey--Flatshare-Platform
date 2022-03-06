import express from "express";
import { client } from "../app";
import tables from "../tables";

export const commentRoutes = express.Router();

commentRoutes.get("/:rid", async (req, res) => {
    try {
        const roomID = req.params.rid;

        const queryResult = await client.query(
            /*sql*/ `SELECT comments.*, users.profile_img, users.name FROM ${tables.COMMENTS} INNER JOIN ${tables.USERS} ON comments.user_id = users.id WHERE comments.room_id = $1`,
            [roomID]
        );
        const comments = queryResult.rows;

        console.log(comments);

        res.status(200).json({ data: comments }).end();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});

commentRoutes.post("/:rid", async (req, res) => {
    try {
        const roomID = req.params.rid;
        const userID = req.session["user"].id;
        const title = req.body.title;
        const message = req.body.message;

        await client.query(
            /*sql*/ `INSERT INTO ${tables.COMMENTS} (title, message, created_at, updated_at, room_id, user_id) VALUES ($1, $2, NOW(), NOW(), $3, $4)`,
            [title, message, roomID, userID]
        );

        res.status(200).json({ message: "success" }).end();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});
