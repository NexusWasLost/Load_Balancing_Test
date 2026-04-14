import express from "express";
import morgan from "morgan";
import { loadDB } from "./model/DB.js";
import eventModel from "./model/schema.js";
await loadDB();

const app = express();
app.use(morgan("tiny"));

app.use(express.json());

app.get("/", function (req, res) {
    try {
        res.status(200).json({
            message: "Hello From Server",
            status_code: 200
        });
    }
    catch (error) {
        console.log("SERVER ERR: ", error);
        res.status(500).json({
            message: "Server Err",
            status_code: 500
        });
    }
});

app.post("/event", async function (req, res) {
    try {
        const { eventName, timestamp, meta } = req.body;

        await eventModel.insertOne();

        res.status(200).json({
            message: "Hello From Server",
            status_code: 200
        });
    }
    catch (error) {
        console.log("SERVER ERR: ", error);
        res.status(500).json({
            message: "Server Err",
            status_code: 500
        });
    }
});

app.listen(3000, function () {
    console.log("App Listening on PORT 3K...");
})
