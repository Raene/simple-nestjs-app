# abdulrahman-babatunde-salau

## Getting started

Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/) installed.
The Dockerfiles use node:16.13.1-alpine3.14 there is a SHA hash added to preserve authencity

This Project uses the microservice architecture and runs two services namely:

- [node_service](./node_service/README.md)
- [prune_job_service](./prune_job_service/README.md)

You can click on the links for both services to view their README.md documentation, these README.md documents my thought processes for each service along with their API documentations.

Before running the Project make sure you have created a .env file in the root folder following the sampleEnv in the same root folder.
**When setting the env file, note the CORS_ORIGIN variable, you can use that to specify the origin you wish your CORS to recognize, if left blank the default value is**

Rate limiting is used on to protect the node_service APIs to protect against Brute force attacks, using the env vars you may configure the behaviour as you wish
**The env vars THROTTLE_TTL and THROTTLE_LIMIT are both setting a time to live for the Rate Limiter and a Limit on the amout of requests you can make to the api within the specified time to live, e.g a ttl of 60 and a limit of 1 means 1 request every limit**
To run the project simply run.

 ```bash
bash start.sh
```

if you wish to work on the project then run

```bash
bash start-dev.sh
```

to run in development mode and create file bindings

in the terminal, make sure you are in the root project directory because that is where the .sh file is located.

The start.sh file loads the .env file in the project root and adds the fields from it to the systems environment before running a docker build on the docker-compose file. This makes the environment variables specified in the env file available to docker in the terminal so the services that need them can load them into the process.env.

## node_service

Currently only the node_service is exposed to the web since it contains CRUD APIs for storing node stats as specified in the Task Definition.
**This service uses JWT Authentication to protect its CREATE, UPDATE and DELETE routes, so in the .env make sure the JWT_SECRET you set matches the jwt secret key you use on whatever service generates your JWT token the JWT token is a Bearer auth token**
The codebase is written in Nestjs and Typescript. They are unit tests for the various services and controllers to run them simply:

```bash
cd node_service && npm run test
```

Swagger API documentation for the service can be seen by visiting.

```http
[base url]/apis
```

visit [node_service](./node_service/README.md) for more information on how this service works.

The node_service is run by Docker-compose so running the bash script will start this service.

## prune_job_service

This is a service contains a Nightly job that runs every 24hours by 23:59pm each day to prune data and preserve only the Hourly points.

It consists of just one index.js file which contains the logic for the daily pruning.

visit [prune_job_service](./prune_job_service/README.md) for more information on how this service works.
