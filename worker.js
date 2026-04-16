import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./config.js";
import eventModel from "./model/schema.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

function attachedListenersToWorker(worker) {
    // worker.on("completed", function (job) {
    //     console.log(`${job.id} has completed!`);
    // });

    worker.on("failed", function (job, err) {
        console.log(`${job.id} has failed with ${err.message}`);
    });
}

//write counter
let write_counter = 0;
//batch size
const BATCH_SIZE = 25;
//global batch buffer
let batchBuffer = [];

async function writeAndFlush() {
    //drain the batch buffer to a local buffer and empty the global buffer
    let localBuffer = [...batchBuffer];
    batchBuffer = [];

    try {

        let formattedBuffer = localBuffer.map(function (item) {
            return {
                eventName: item.eventName || null,
                timestamp: item.timestamp || Date.now(),
                meta: item.meta || null
            };
        });

        const ev = await eventModel.insertMany(formattedBuffer, { ordered: false });
        write_counter++;
    }
    catch (error) {
        console.log("[WORKER ERR]: ", error);
    }
}

const worker = new Worker("write-events", async function (job) {

    batchBuffer.push(job.data.item);
    if (batchBuffer.length < BATCH_SIZE) return;

    await writeAndFlush();

}, { connection, concurrency: 50 });
attachedListenersToWorker(worker);

//fallback mechanism
setInterval(async function () {
    try {
        if (batchBuffer.length <= 0) return;

        await writeAndFlush();
        console.log("Fallback triggererd");
        console.log("Total Writes: ", write_counter);
    }
    catch (error) {
        console.log("[WORKER ERR]: ", error);
    }
}, 10000);
