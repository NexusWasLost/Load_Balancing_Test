import http from "k6/http";
import { sleep } from "k6";

export const options = {
    stages: [
        { duration: "10s", target: 200 },  // ramp up to 200
        { duration: "10s", target: 500 },  // ramp up to 500
        { duration: "10s", target: 1000 }, // ramp up to 1000
        { duration: "30s", target: 1000 }, // stay at 1000
    ],
    noConnectionReuse: false
};

export default function(){
    const res = http.post(
        "http://localhost:3000/event",

        JSON.stringify({
            eventName: "TEST_EVENT",
            timestamp: Date.now(),
            meta: { "user_stamp": `STM+${ Date.now() }`}
        }),

        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    sleep(1);
}
