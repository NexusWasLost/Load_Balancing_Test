import express from "express";
import morgan from "morgan";
import { Queue } from "bullmq";
import "./config.js";
import eventModel from "./model/schema.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

//create a queue named foo
const q = new Queue("write-events");

app.post("/event", async function (req, res) {
    try {
        const { eventName, timestamp, meta } = req.body;

        //add to queue
        await q.add("event-item", {
            item: {
                eventName: eventName,
                timestamp: timestamp,
                meta: meta
            }
        });

        res.status(200).json({
            message: "Data Inserted Successfully",
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

app.get("/count-events", async function (req, res) {
    try {
        const count = await eventModel.countDocuments();
        res.status(200).json({
            message: "Events Counted Successfully",
            count: count,
            status_code: 500
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

app.delete("/del-events", async function (req, res) {
    try {
        const deletedCount = await eventModel.deleteMany();
        res.status(200).json({
            message: "Events Deleted Successfully",
            count: deletedCount,
            status_code: 500
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
