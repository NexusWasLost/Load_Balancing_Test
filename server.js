import express from "express";
import morgan from "morgan";
import { Queue } from "bullmq";

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
            item:{
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

app.listen(3000, function () {
    console.log("App Listening on PORT 3K...");
})
