import express from "express";
import { client } from "../app";
import tables from "../tables";
import { io } from "../app";

export const applicationRoutes = express.Router();

applicationRoutes.get("/user", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS} INNER JOIN ${tables.APPLICATIONS} ON rooms.id = applications.room_id WHERE applications.applicant_id = $1 AND applications.status = $2`,
        [req.session["user"].id, 1]
    );
    const rooms = queryResult.rows;

    if (rooms.length == 0) {
        res.status(200).json({ data: false }).end();
        return;
    }
    res.status(200).json({ data: rooms }).end();
});

applicationRoutes.get("/user/:rid", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const roomID = req.params.rid;

    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS} INNER JOIN ${tables.APPLICATIONS} ON rooms.id = applications.room_id WHERE applications.applicant_id = $1 AND rooms.id = $2 AND applications.status = 1`,
        [req.session["user"].id, roomID]
    );
    const room = queryResult.rows[0];

    if (!room) {
        res.status(200).json({ result: false }).end();
        return;
    }

    res.status(200).json({ result: true }).end();
});

applicationRoutes.get("/living", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS} INNER JOIN ${tables.APPLICATIONS} ON rooms.id = applications.room_id WHERE applications.applicant_id = $1 AND applications.status = $2`,
        [req.session["user"].id, 2]
    );
    const livingRoom = queryResult.rows[0];

    res.status(200).json({ data: livingRoom }).end();
});

applicationRoutes.get("/isLiving/:rid", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }
    const roomID = req.params.rid;
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS} INNER JOIN ${tables.APPLICATIONS} ON rooms.id = applications.room_id WHERE applications.applicant_id = $1 AND applications.status = $2 AND applications.room_id = $3`,
        [req.session["user"].id, 2, roomID]
    );
    const livingRoom = queryResult.rows[0];

    res.status(200).json({ data: livingRoom }).end();
});

applicationRoutes.get("/apply/:rid", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Login to apply this room" });
        return;
    }

    const hostID = (
        await client.query(
            /*sql*/ `SELECT host_id FROM ${tables.ROOMS} WHERE id = $1`,
            [req.params.rid]
        )
    ).rows[0].host_id;

    await client.query(
        /*sql*/ `INSERT INTO ${tables.APPLICATIONS} (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            1,
            new Date(),
            new Date(),
            req.params.rid,
            req.session["user"].id,
            hostID,
        ]
    );
    io.emit("new-application");
    res.status(200).json({ message: "Applied room" }).end();
});

applicationRoutes.get("/accept/:aid", async (req, res) => {
    try {
        const applicationID = req.params.aid;

        const applicationData = (
            await client.query(
                /*sql*/ `UPDATE ${tables.APPLICATIONS} SET status = $1 WHERE id = $2 RETURNING applicant_id, room_id`,
                [2, applicationID]
            )
        ).rows[0];

        const applicantID = applicationData.applicant_id;
        // const roomID = applicationData.room_id;

        // await client.query(
        //     /*sql*/ `UPDATE ${tables.APPLICATIONS} SET status = $1 WHERE room_id = $2 AND status = $3`,
        //     [3, roomID, 1]
        // );

        await client.query(
            /*sql*/ `UPDATE ${tables.APPLICATIONS} SET status = $1 WHERE applicant_id = $2 AND status = $3`,
            [3, applicantID, 1]
        );
        io.emit("accept-application");
        res.status(200).json({ message: `Accepted application` }).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});

applicationRoutes.get("/decline/:aid", async (req, res) => {
    try {
        const applicationID = req.params.aid;

        await client.query(
            /*sql*/ `UPDATE ${tables.APPLICATIONS} SET status = $1 WHERE id = $2`,
            [3, applicationID]
        );

        res.status(200).json({ message: `Declined application` }).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});

applicationRoutes.delete("/:aid", async (req, res) => {
    try {
        const applicationID = req.params.aid;

        await client.query(
            /*sql*/ `DELETE FROM ${tables.APPLICATIONS} WHERE id = $1`,
            [applicationID]
        );
        io.emit("delete-application");
        res.status(200).json({ message: `Cancelled application` }).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});
