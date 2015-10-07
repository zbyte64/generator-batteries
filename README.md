Batteries Included Microservices.

(Not yet ready)

TODO:

* auth to issue authorizations w/o user lookup
* migrations
* fix up client
* public/index.html - marketing page
* bower -> public
* npm init? ensure initial requirements are installed
* ? oauth2: auth to be a server: https://github.com/thomseddon/koa-oauth-server ; api to be consumer
* ? passport-jwt


# Batteries

* `Auth` Koa + Bookshelf + Login & Registration
* `Api` Node Restify
* `Client` Angular2 + JSPM + Babel
* `Proxy` Mounts all the batteries
* `public` Static assets
* `common` Available to all services

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

Or:

```
  docker-compose up
```
