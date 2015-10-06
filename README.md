Batteries Included Microservices.

(Not yet ready)

TODO:

* resolve common code for auth & api; example: user lookup
* migrations
* fix up client


# Batteries

* `Auth` Koa + Bookshelf + Login & Signup
* `Api` Node Restify
* `Client` Angular2 + JSPM + Babel
* `Common` Glue, ORM, Business Rules
* `Proxy` Mounts all the batteries

All apps share a secret and read from a HMAC cookie session.
Each app runs in a docker container or as a process.


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
