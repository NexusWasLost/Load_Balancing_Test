# Load-Balancing-Test

I wanted to try Load Balancing (Clustering) to scale instances and get performance improvement for a simple event logging module.

## Get Started

- Clone the repo and navigate into it, then install dependencies using `npm install`.

- The root (`/`) contains all the source code.

- The "model" folder contain database connection setup and schema.

## How to test ?

Postman collection and K6 test script is already included in the repo.

`server.js` file is the entry point for the Express app.

3 Endpoints

- `/event` (POST): Used to post an event. Pushes data to queue that is picked up by worker and inserted into DB.

Parameters (`JSON`)

1. eventName: String
2. timestamp: Date (Defaults to `Date.now()`)
3. meta: Can accept Strings or objects (used for additional data)

- `/count-events` (GET): Used to Get the total count of documents (events) in DB.

- `/del-events` (DELETE): Delete all events from DB.

## Running a Singular Instance

Start the server using `npm run dev` and on a separate terminal run `node worker.js` to activate the worker.

And the server is ready to be used. Use Postman or similar tool to hit endpoints.

## Running multiple PM2 clusters


Pre-requisites: [PM2](https://pm2.keymetrics.io/)

Install PM2 using

```bash
npm install pm2 -g
```

Run desired amount of instances of server and worker process using the following PM2 command

```bash
pm2 start server.js -i 2
```

```bash
pm2 start worker.js -i 2
```

This spins up 2 instances of both the processes.

To monitor usage and performance use:

```bash
pm2 monit
```

---

*NOTE there must be a local running redis server !! If on Windows use Docker to spin up a container running a Redis server.*

View: [Running a Redis container](https://redis.io/tutorials/operate/orchestration/docker/).

## Running the test script using K6

In a terminal run `k6 run test.js` to run the test !

The base test is set to 4 stages:

```js
stages: [
    { duration: "10s", target: 200 },  // ramp up to 200
    { duration: "10s", target: 500 },  // ramp up to 500
    { duration: "10s", target: 1000 }, // ramp up to 1000
    { duration: "30s", target: 1000 }, // stay at 1000
]
```
To reset DB write counter the workers must be restarted.

## Changing Test Duration and VUs

Just open `test.js` and change stages to anything required. Save and run again !
