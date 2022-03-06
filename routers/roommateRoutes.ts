import express from "express";
import { client } from "../app";
import tables from "../tables";

export const roommateRoutes = express.Router();

roommateRoutes.get("/host/:hid", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const hostID = req.params.hid;
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.USERS} INNER JOIN ${tables.APPLICATIONS} ON users.id = applications.applicant_id WHERE applications.status = 2 AND applications.host_id = $1 AND applications.host_id = $2`,
        [hostID, req.session["user"].id]
    );
    const guests = queryResult.rows;

    if (guests.length == 0) {
        res.status(200).json({ data: false }).end();
        return;
    }
    res.status(200).json({ data: guests }).end();
});

roommateRoutes.get("/guest/:hid", async (req, res) => {
    if (!req.session["user"]) {
        res.status(400).json({ message: "Invalid request" });
        return;
    }

    const hostID = req.params.hid;
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.USERS} INNER JOIN ${tables.APPLICATIONS} ON users.id = applications.applicant_id WHERE applications.status = 2 AND applications.host_id = $1 AND applications.applicant_id != $2`,
        [hostID, req.session["user"].id]
    );
    const roommates = queryResult.rows;

    if (roommates.length == 0) {
        res.status(200).json({ data: false }).end();
        return;
    }
    res.status(200).json({ data: roommates }).end();
});
