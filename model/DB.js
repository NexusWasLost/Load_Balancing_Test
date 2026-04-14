import mongoose from "mongoose";

export async function loadDB(){
    let db = mongoose.connection;
    connectDBListeners(db);
    await mongoose.connect("mongodb://127.0.0.1:27017/testing");
}

function connectDBListeners(db){
    //server event listeners
    db.on("connected", function() {
        console.log("Connected to database");
    });

    db.on("disconnected", function() {
        console.log("Disconnected from database");
    });

    db.on("error", function(error) {
        console.log("MongoDB connection error" + error);
    });
}
