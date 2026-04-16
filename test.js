import http from "k6/http";
import { sleep } from "k6";

export const options = {
    vus: 750,
    duration: "60s",
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
