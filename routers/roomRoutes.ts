import express from "express";
import multer from "multer";
import path from "path";
import { client } from "../app";
import tables from "../tables";
import { io } from "../app";

export const roomRoutes = express.Router();

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

roomRoutes.get("/", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS}`
    );
    const rooms = queryResult.rows;

    res.status(200).json({ data: rooms }).end();
});

roomRoutes.get("/hosting", async (req, res) => {
    let userData = req.session["user"].id;
    if (!userData) {
        res.status(403).json({ fail: true }).end();
        return;
    }
    const room = (
        await client.query(
            /*sql*/ `SELECT * FROM ${tables.ROOMS} WHERE host_id = $1`,
            [userData]
        )
    ).rows[0];
    const applicantsData = await client.query(
        /*sql*/ `SELECT users.id AS uid, applications.id AS aid, name,email,birth_date,budget,description,gender,occupation,profile_img 
        FROM ${tables.USERS} inner join ${tables.APPLICATIONS} on users.id = applications.applicant_id where applications.host_id =$1 AND applications.status = $2`,
        [userData, 1]
    );
    const applicants = applicantsData.rows;

    res.status(200).json({ app: applicants, room: room }).end();
});

roomRoutes.get("/isHosting", async (req, res) => {
    let userID = req.session["user"].id;
    if (!userID) {
        res.status(400).json({ message: "Invalid request" }).end();
        return;
    }

    const hostingRoom = (
        await client.query(
            /*sql*/ `SELECT * FROM ${tables.ROOMS} WHERE host_id = $1`,
            [userID]
        )
    ).rows[0];

    if (hostingRoom) {
        res.status(200).json({ result: true }).end();
        return;
    }
    res.status(200).json({ result: false }).end();
});

roomRoutes.get("/:rid", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOMS} WHERE id = $1`,
        [req.params.rid]
    );
    const room = queryResult.rows[0];

    res.status(200).json({ data: room }).end();
});

roomRoutes.post("/", upload.array("image", 3), async (req, res) => {
    try {
        const district = req.body.district;
        const address = req.body.address;
        const size = req.body.size;
        const monthlyRent = req.body.rent;
        const tenantNumber = req.body.member;
        const rentalPeriod = req.body.period;
        const rules = req.body.rules;
        const aircon = req.body.aircon;
        const bed = req.body.bed;
        const chair = req.body.chair;
        const cooker = req.body.cooker;
        const couch = req.body.couch;
        const fans = req.body.fans;
        const desk = req.body.desk;
        const television = req.body.television;
        const washer = req.body.washer;
        const wifi = req.body.wifi;
        const roomImage_1 = req!.files![0].filename;
        const roomImage_2 = req!.files![1].filename;
        const roomImage_3 = req!.files![2].filename;

        console.log(roomImage_1, roomImage_2, roomImage_3);

        const roomID = (
            await client.query(
                /*sql*/ `INSERT INTO ${tables.ROOMS} (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
                [
                    district,
                    address,
                    size,
                    monthlyRent,
                    rentalPeriod,
                    rules,
                    tenantNumber,
                    new Date(),
                    new Date(),
                    req.session["user"].id,
                ]
            )
        ).rows[0].id;

        await client.query(
            /*sql*/ `INSERT INTO ${tables.EQUIPMENTS} (aircon, bed, chair, cooker, couch, desk, fans, television, washer, wifi, room_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                aircon,
                bed,
                chair,
                cooker,
                couch,
                desk,
                fans,
                television,
                washer,
                wifi,
                roomID,
            ]
        );

        await client.query(
            /*sql*/ `INSERT INTO ${tables.ROOM_IMAGE} (room_img_id, img, room_id) VALUES ($1, $2, $3)`,
            [1, roomImage_1, roomID]
        );
        await client.query(
            /*sql*/ `INSERT INTO ${tables.ROOM_IMAGE} (room_img_id, img, room_id) VALUES ($1, $2, $3)`,
            [2, roomImage_2, roomID]
        );
        await client.query(
            /*sql*/ `INSERT INTO ${tables.ROOM_IMAGE} (room_img_id, img, room_id) VALUES ($1, $2, $3)`,
            [3, roomImage_3, roomID]
        );

        io.emit("new-room");
        res.status(200).json({ message: "Room is successfully posted" }).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" }).end();
    }
});
