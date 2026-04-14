import express from "express";
import morgan from "morgan";
import { loadDB } from "./model/DB.js";
import eventModel from "./model/schema.js";
await loadDB();

const app = express();
app.use(morgan("tiny"));

app.use(express.json());

app.post("/event", async function (req, res) {
    try {
        const { eventName, timestamp, meta } = req.body;

        const ev = await eventModel.insertOne({
            eventName: eventName,
            timestamp: timestamp,
            meta: meta
        });
        console.log(ev);

        res.status(200).json({
            message: "Data Inserted Successfully",
            status_code: 200,
            id: ev._id
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
