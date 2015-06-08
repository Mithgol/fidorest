[![(a histogram of downloads)](https://nodei.co/npm-dl/fidorest.png?height=3)](https://npmjs.org/package/fidorest)

This module (`fidorest`) provides (in a form of RESTful API) a remote interface to a Fidonet system.

It is designed as a web application for the [Express.js](http://expressjs.com/) web server.

This module is currently in an early phase of its development and thus does not have the desired level of feature completeness.

## Installing FidoREST

[![(npm package version)](https://nodei.co/npm/fidorest.png?downloads=true&downloadRank=true)](https://npmjs.org/package/fidorest)

* Latest packaged version: `npm install fidorest`

* Latest githubbed version: `npm install https://github.com/Mithgol/fidorest/tarball/master`

You may visit https://github.com/Mithgol/fidorest#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using FidoREST

When you `require()` the installed module, you get a function that accepts an object of options and returns an Express.js application that provides REST API to your system.

**Example 1. ** You may serve the FidoREST application on a route (path) of your Express-based web server:

```js
var express = require('express');
var app = express();

var FidoREST = require('fidorest')(options_for_FidoREST);
app.use('/fidorest', FidoREST);
```

**Example 2. ** You may also use the [`vhost`](https://github.com/expressjs/vhost) module to serve the FidoREST application on a virtual host of your Express-based web server:

```js
var vhost = require('vhost');
var express = require('express');
var app = express();

var FidoREST = require('fidorest')(options_for_FidoREST);
app.use(vhost('fidorest.example.org', FidoREST));
```

**Example 3. ** You may also directly use the FidoREST application itself as your Express-based web server (if that server's only purpose is to provide the FidoREST API).

HTTP example:

```js
require('fidorest')(options_for_FidoREST).listen(80);
```

HTTPS example:

```js
var fs = require('fs');

require('https').createServer(
   {
      key:   fs.readFileSync('somepath/server.key'),
      cert:  fs.readFileSync('somepath/server.crt'),
      honorCipherOrder: true
   },
   require('fidorest')(options_for_FidoREST)
).listen(443);
```

**Note. ** You should create a configuration file for the installed FidoREST module before you use it. (See below.)

## Configuration options

The `options_for_FidoREST` object that is given to FidoREST currently has only one property:

* `configFilePath` — the path to the configuration file. That file contains most of the other configuration options in their text from, one line per option. (By default it is the file `fidorest.conf` in the directory of the FidoREST module. You may use `fidorest.conf-example` as an example.)

The configuration file is read only once (when the server starts).

The following configuration options are supported (in arbitrary order):

* `Address` — FTN address of the system.

* `SysOp` — full name of the system's operator.

## FidoREST API

An initial idea of what this module should do (when it is completed) was published in Fidonet:

* [`area://Ru.Husky?msgid=2:50/88+5565c79e`](http://ftn.su/m/RU.HUSKY/2:50/88+5565c79e)

The following types of requests are planned:

* [Request metadata about the server and the underlying Fidonet system.](#get-)

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Change metadata about the server and the underlying Fidonet system.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request the list of freq-able files (actually just downloadable via FidoREST API, see below) and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Some implementation of a freq (file request), i.e. downloading a file (knowing its name) from the Fidonet system.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request the list of file echomail areas and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) List the files in the designated echomail area and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request detailed metadata of the designated file from the designated file echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Get the designated file from the designated file echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Publish a file in a file echomail area (including some file's metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Erase the designated file from the designated file echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Subscribe to a file echomail area (declare that it's interesting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Unsubscribe from a file echomail area (declare that it's no longer interesting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request the list of echomail areas and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) List the messages in the designated echomail area and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request detailed metadata of the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Get the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Publish a message in an echomail area (including that message's header and some other metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Erase the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Send a netmail message (including that message's header and some other metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Receive netmail messages that weren't received before.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Subscribe to an echomail area (declare that it's interesting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Unsubscribe from an echomail area (declare that it's no longer interesting).

### GET /

HTTP GET request is sent to the root of FidoREST. (In examples 2 and 3 the root directory of the server is requested; in example 1 it is the FidoREST's subdirectory under the server's root.)

The response is a JSON object with the following properties:

* `soft` — *(string)* name of the application and its version. (For example, `"FidoREST 0.0.2"` in one of the most early versions of this implementation. Note: in other implementations the application's name is likely **not** to be `FidoREST`; do not use it to detect the presence of FidoREST interface.)

* `sys` — *(string)* name of the system's operator.

* `address` — array of *(string)* FTN addresses. Each address is given in the form `zone:net/node.point@domain`, where `zone` and `net` and `node` and `point` are natural numbers. The `@domain` part is optional (if it is absent, `@fidonet` is the default). The `.point` part is optional (if it is absent, the system is a node and not a point). Example: `"9:9999/9999"`.

## Testing FidoREST

[![(build testing status)](https://img.shields.io/travis/Mithgol/fidorest/master.svg?style=plastic)](https://travis-ci.org/Mithgol/fidorest)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the FidoREST module).

After that you may run `npm test` (in the directory of the FidoREST module). Only the JS code errors are caught; the code's behaviour is not tested.

## License

MIT license (see the `LICENSE` file).
