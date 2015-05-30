[![(a histogram of downloads)](https://nodei.co/npm-dl/fidorest.png?height=3)](https://npmjs.org/package/fidorest)

This module (`fidorest`) provides (in a form of RESTful API) a remote interface to a Fidonet system.

It is designed as a web application for the [Express.js](http://expressjs.com/) web server.

This module is currently in an early phase of its development and thus does not have the desired level of feature completeness. An initial idea of what this module should do (when it is completed) was published in Fidonet:

* [`area://Ru.Husky?msgid=2:50/88+5565c79e`](http://ftn.su/m/RU.HUSKY/2:50/88+5565c79e)

## Installing FidoREST

[![(npm package version)](https://nodei.co/npm/fidorest.png?downloads=true&downloadRank=true)](https://npmjs.org/package/fidorest)

* Latest packaged version: `npm install fidorest`

* Latest githubbed version: `npm install https://github.com/Mithgol/fidorest/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/fidorest#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using FidoREST

When you `require()` the installed module, you get a function that accepts an object of options and returns an Express.js application that provides REST API to your system.

You may serve that application on a route (path) of your Express-based web server:

```js
var FidoREST = require('fidorest')(options_for_FidoREST);
app.use('/fidorest', FidoREST);
```

You may also use the [`vhost`](https://github.com/expressjs/vhost) module to serve that application on a virtual host of your Express-based web server:

```js
var vhost = require('vhost');
var FidoREST = require('fidorest')(options_for_FidoREST);
app.use(vhost('fidorest.example.org', FidoREST));
```

You should create a configuration file for the installed FidoREST module before you use it. (See below.)

## Configuration options

The `options_for_FidoREST` object that is given to FidoREST currently has only one property:

* `configFilePath` — the path to the configuration file. That file contains most of the other configuration options in their text from, one line per option. (By default it is the file `fidorest.conf` in the directory of the FidoREST module. You may use `fidorest.conf-example` as an example.)

The configuration file is read only once (when the server starts).

The following configuration options are supported (in arbitrary order):

* `Address` — FTN address of the system.

* `SysOp` — full name of the system's operator.

## License

MIT license (see the `LICENSE` file).
