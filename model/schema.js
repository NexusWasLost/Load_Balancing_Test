import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        default: null
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    meta: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const eventModel = new mongoose.model("Event", eventSchema);
export default eventModel;
