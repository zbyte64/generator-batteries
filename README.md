Batteries Included Microservices.

(Not yet ready)


# Batteries

* `Auth` ExpressJS + Swig + Login & Signup
* `Api` Node Restify
* `Client` Angular2 + JSPM + Babel
* `Common` Glue, ORM, Crypto strategies
* `Proxy` Mounts all the batteries

All apps share a secret and read the cookie session as a jwt.
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
