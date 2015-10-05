Batteries Included Microservices.

(Not yet ready)


# Batteries

* `Auth` ExpressJS + Swig + Waterline + Login & Signup //TODO koa & koa-views & koa-connect
* `Api` Node Restify
* `Client` Angular2 + JSPM + Babel
* `Common` Glue, ORM, Buisiness Rules
* `Proxy` Mounts all the batteries

All apps share a secret and read from a HMAC cookie session.
Each app runs in a docker container or as a service.


# Getting started

Install:

```
  npm install generate-batteries
  yo batteries  
```

Run project:

```
  npm start
```

```
  docker-compose up
```
