import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import expressSession from "express-session";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIO } from "socket.io";
import tables from "./tables";
import { loginRoutes } from "./routers/loginRoutes";
import { logoutRoutes } from "./routers/logoutRoutes";
import { roomRoutes } from "./routers/roomRoutes";
import { userRoutes } from "./routers/userRoutes";
import { applicationRoutes } from "./routers/applicationRoutes";
import { roommateRoutes } from "./routers/roommateRoutes";
import { commentRoutes } from "./routers/commentRoutes";
// import multer from "multer";
// import { hashPassword } from "./hash";

const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server);

dotenv.config();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve("./uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(
//             null,
//             `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
//         );
//     },
// });
// const upload = multer({ storage });

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

client.connect();

app.use(express.json());

app.use(
    expressSession({
        secret: "Homey is Good",
        resave: true,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    console.log(`[INFO] request path: ${req.path}, method: ${req.method}`);
    next();
});

//socket.io
io.on("connection", (socket) => {
    console.log(`[INFO] socket: ${socket.id} is connected`);
});

app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/application", applicationRoutes);
app.use("/roommate", roommateRoutes);
app.use("/comment", commentRoutes);

app.get("/checkIsLoggedIn", (req, res) => {
    if (req.session && req.session["user"]) {
        res.json({ result: true, uid: req.session["user"].id }).end();
        return;
    }
    res.json({ result: false }).end();
});

app.get("/roomImage/:rid", async (req, res) => {
    const queryResult = await client.query(
        /*sql*/ `SELECT * FROM ${tables.ROOM_IMAGE} WHERE room_id = $1`,
        [req.params.rid]
    );
    const roomImages = queryResult.rows;

    res.status(200).json({ data: roomImages }).end();
});

const isLoggedIn = function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (request.session["user"]) {
        next();
        return;
    }
    response.redirect("/login.html");
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(isLoggedIn, express.static(path.join(__dirname, "private")));

app.use(function (request, response) {
    response.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`[info] listening to port ${PORT}`);
});
