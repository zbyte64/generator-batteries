Batteries Included Microservices.

(Not yet ready)

TODO:

* auth to issue authorizations; usable w/o user lookup
* fix up client
* public/index.html - landing page
* bower -> public
* gulp init
* ? oauth2: auth to be a server: https://github.com/thomseddon/koa-oauth-server ; api to be consumer
* ? passport-jwt


# Batteries

* `/auth` Koa + Bookshelf + Login & Registration
* `/api` Node Restify
* `/client` Angular2 + JSPM + Babel
* `proxy` Mounts all the batteries
* `public` Static assets
* `common` Available to all services

Docker is optional. Services can be switched out.

All apps share a secret and read from a HMAC cookie session.
Each app runs in a docker container or as a process.


# Getting started

Install:

```
  npm install generate-batteries
  yo batteries  
```
