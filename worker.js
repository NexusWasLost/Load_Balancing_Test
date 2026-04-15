import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./config.js";
import eventModel from "./model/schema.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

function attachedListenersToWorker(worker) {
    worker.on("completed", function (job) {
        console.log(`${job.id} has completed!`);
    });

    worker.on("failed", function (job, err) {
        console.log(`${job.id} has failed with ${err.message}`);
    });
}

const worker = new Worker("write-events", async function (job) {

    const eventItem = job.data.item;
    console.log(eventItem);

    try{
        const ev = await eventModel.insertOne({
            eventName: eventItem.eventName,
            timestamp: eventItem.timestamp,
            meta: eventItem.meta
        });
        console.log(ev);
    }
    catch(error){
        console.log("[WORKER ERR]: ", error);
    }

}, { connection, concurrency: 1 });
attachedListenersToWorker(worker);
