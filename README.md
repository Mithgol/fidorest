[![(a histogram of downloads)](https://nodei.co/npm-dl/fidorest.png?height=3)](https://npmjs.org/package/fidorest)

This module (`fidorest`) provides (in a form of RESTful API) a remote interface to a Fidonet system.

It is designed as a web application for the [Express.js](http://expressjs.com/) web server.
* Starting from v0.1.1, this module requires Node.js version 4.0.0 or newer.
* You may run older versions of this module in Node.js version 0.10.x or 0.12.x. These older versions of this module, however, had to contain additional dependencies as polyfills for missing ECMAScript 2015 (ES6) features which are now present in Node.js itself. These older versions of Node.js are themselves not maintained by their developers after 2016-12-31.

This module is currently in an early phase of its development and thus does not have the desired level of feature completeness.

## Installing FidoREST

[![(npm package version)](https://nodei.co/npm/fidorest.png?downloads=true&downloadRank=true)](https://npmjs.org/package/fidorest)

* Latest packaged version: `npm install fidorest`

* Latest githubbed version: `npm install https://github.com/Mithgol/fidorest/tarball/master`

You may visit https://github.com/Mithgol/fidorest#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

**Note: ** [Express.js](http://expressjs.com/) dependency is declared in [`peerDependencies`](https://docs.npmjs.com/files/package.json#peerdependencies) section and thus it won't be automatically installed by npm version 3 (or newer) when you install FidoREST. You are expected to install (separately) both Express and FidoREST as the dependencies of your own web server.

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

The `options_for_FidoREST` object that is given to FidoREST currently has the following properties:

* `secure` — optional (by default, `false`) property you may set to `true` to indicate that the server is secure (HTTPS server).

* `configFilePath` — the path to the configuration file. That file contains most of the other configuration options in their text form, one line per option. (By default it is the file `fidorest.conf` in the directory of the FidoREST module. You may use `fidorest.conf-example` as an example.)

The configuration file is read only once (when the server starts).

The following configuration options are supported (in arbitrary order):

* `Address` — FTN address of the system. *(required)*

* `SysOp` — full name of the system's operator.

* `PublicKey` — path to the file containing ASCII-armored public key of the system as described [in RFC 4880](http://tools.ietf.org/html/rfc4880).
   * If the path is relative, it is treated as relative to the directory of the FidoREST module.

* `PrivateKey` — path to the file containing ASCII-armored private key of the system as described [in RFC 4880](http://tools.ietf.org/html/rfc4880).
   * If the path is relative, it is treated as relative to the directory of the FidoREST module.
   * The key's passphrase is expected to be blank because its use in FidoREST is automated.

* `CreateMissingKeys create` — if the option `CreateMissingKeys` is present and equal to `create`, then the files containing ASCII-armored public and private keys of the system are created if both of them don't exist.
   * The first `Address` value is used as the User ID for these keys.
   * `CreateMissingKeys` is a useful option when you create a new FidoREST system. However, you may want to comment this option later to avoid the keys being accidentally re-created if anything goes wrong with your file system. Also, as a precaution, the server is immediately shut down after the keys are generated. (You may comment `CreateMissingKeys` before starting it again.)

* `databaseFidoREST` — path to the SQLite database file that is used by FidoREST as its data storage. (By default, `dbFidoREST.sqlite`.)
   * If the path is relative, it is treated as relative to the directory of the FidoREST module.
   * If the database file does not exist, it is created. Also, as a precaution, the server is immediately shut down after the database is created. This may help to detect the situation where the database is accidentally re-created if anything goes wrong with your file system and thus the usual database is not accessible.

* `AreasHPT` — path to the area configuration file of HPT. This setting is necessary for PhiDo to know where the echomail resides.
   * The configuration file is read only once (when the server starts).
   * The configuration lines for echomail are expected to start with `EchoArea` (literally), then a whitespace-separated echotag (such as `Ru.FTN.Develop` for example), then a whitespace-separated full path (without the extensions) to the echomail files of the area, in that order. (A sequence of several whitespaces is also a supported separator.) The rest of the configuration line is also whitespace-separated from the path.
   * If the `-d "some description"` is found on the same line, it is used as the echomail area's description.
   * Only JAM echomail areas are supported. Names of echo base files are generated by appending lowercase extensions (`.jhr`, `.jdt`, `.jdx`, `.jlr`) to the given path.

* `EncodingHPT` — the encoding of non-ASCII characters in the HPT areafile. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `ZIPNodelist` — path to a ZIP-packed nodelist.

* `FTPFileechoList` — path to a list of FTP-mirrored fileechoes. The list itself must adhere to the format understood by the [`ftp-fileecho-list`](https://github.com/Mithgol/node-ftp-fileecho-list) module. Several `FTPFileechoList` configuration lines may appear in the configuration file in the reverse order of their importance (i.e. given from the most important to the least important): if a particular fileecho is present in several lists, that fileecho's URL is based on the first (and not the last) of such lists.

* `FreqDir` — a path to the directory containing files that are available for file requests.
   * If the given path is relative, it is treated as relative to the directory of FidoREST (where its `package.json` resides).
   * Each file in the designated directory can be requested.
   * If several `FreqDir` lines are given in the configuration, they're processed in the order of appearance. For example, if the first of such directories contains a file with the name given in a file request, then that file is used instead of its namesakes from latter directories. (Files are treated as namesakes if their filenames after `.toLowerCase()` become equal to each other.)
   * Subdirectories of a given directory are not automatically processed (though you may add their own `FreqDir` lines to make their files available as well).
   * If the given path is invalid (i.e. the directory does not exist or is not accessible), it is silently ignored.
   * Do not make your private key files available for file requests.

### Examples of external configuration files

Examples of the area configuration file of HPT are available in its own CVS repository on SourceForge [in English](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas) and [in Russian](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas.ru). Text lines of these examples are commented out (by `#` characters in the lines' beginnings) but your real configuration lines must be uncommented.

## FidoREST API

An initial idea of what this module should do (when it is completed) was published in Fidonet:

* [`area://Ru.Husky?msgid=2:50/88+5565c79e`](http://ftn.su/m/RU.HUSKY/2:50/88+5565c79e)

The following types of requests were planned:

* [Request metadata about the server and the underlying Fidonet system.](#get-)

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Change metadata about the server and the underlying Fidonet system.

* [Request the list of freq-able files (actually just downloadable via FidoREST API, see below) and their metadata.](#get-freqlist)

* [An implementation of a freq (file request): downloading a file (knowing its name) from the Fidonet system.](#get-freqfilename)

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request the list of file echomail areas and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) List the files in the designated file echomail area and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request detailed metadata of the designated file from the designated file echomail area.

* [Get the designated file from the designated file echomail area. (If that area is not present on the system, a redirect to an FTP mirror of the area might happen.)](#get-fileechofechonamefilename)

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Publish a file in a file echomail area (including some file's metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Erase the designated file from the designated file echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Subscribe to a file echomail area (declare that it's interesting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Unsubscribe from a file echomail area (declare that it's no longer interesting).

* [Request the list of echomail areas and their metadata.](#get-echolist)

* [Request detailed metadata of the designated echomail area.](#get-areadetailsareaname)

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) List the messages in the designated echomail area and their metadata.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Request detailed metadata of the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Get the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Publish a message in an echomail area (including that message's header and some other metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Erase the designated message from the designated echomail area.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Send a netmail message (including that message's header and some other metadata).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Receive netmail messages that weren't received before.

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Subscribe to an echomail area (declare that it's interesting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Unsubscribe from an echomail area (declare that it's no longer interesting).

The following other interfaces may also be implemented (later):

* An interface for automatic configuration of points (similar to [FRL-1033.003](http://ftsc.org/docs/frl-1033.003), but more simple and RESTful).

* An interface for automatic configuration of links between nodes.

* An interface that makes rules of echomail areas available.

* An interface that allows a moderator to deliver a moderatorial (note: the “read only” mode may happen automatically if configured).

### GET /

HTTP GET request is sent to the root of FidoREST. (In examples 2 and 3 the root directory of the server is requested; in example 1 it is the FidoREST's subdirectory under the server's root.)

It requests **metadata about the server and the underlying Fidonet system.**

The response is a JSON object with the following properties:

* `soft` — *(string)* name of the application and its version. (For example, `"FidoREST 0.0.2"` in one of the most early versions of this implementation. Note: in other implementations the application's name is likely **not** to be `FidoREST`; do not use it to detect the presence of FidoREST interface.)

* `sys` — *(string)* name of the system's operator.

* `address` — array of *(string)* FTN addresses. Each address is given in the form `zone:net/node.point@domain`, where `zone` and `net` and `node` and `point` are natural numbers. The `@domain` part is optional (if it is absent, `@fidonet` is the default). The `.point` part is optional (if it is absent, the system is a node and not a point). Example: `"9:9999/9999"`.

* `abilities` — array of *(string)* case-sensitive keywords identifying available RESTful interfaces. (For example, if only file requests are supported, the value of `abilities` should be `['freqlist', 'freq']` array.)

* `publicKey` — *(string)* ASCII-armored public key of the system as described [in RFC 4880](http://tools.ietf.org/html/rfc4880).

### GET /freqlist

As in the previous request, the `/freqlist` path is relative to the root directory of FidoREST.

It requests **the list of requestable files and their metadata.**

The request's keyword (for the `abilites` array) is `'freqlist'`.

The response is a JSON array; each element of that array corresponds to a file that can be requested using a file request (a freq). Such element has the following properties:

* `name` — *(string)* name of the file.

* `size` — *(number)* size of the file (in bytes).

* `mtime` — *(number)* time when the file's data was last modified (as number of milliseconds elapsed since 1 January 1970 00:00:00 UTC).

### GET /freq/:filename

As in the previous requests, the path is relative to the root directory of FidoREST.

This is a **freq (file request):** a file (designated by its name) is downloaded from the Fidonet system.

(That file's name must be given in the request instead of the `:filename` placeholder. The name is not case-sensitive.)

The request's keyword (for the `abilites` array) is `'freq'`.

If the request is successful, the file is served.

Otherwise an error (`404 Not Found`) happens and the corresponding JSON object (`{"error":"File not found."}`) is served.

### GET /fileecho/:fechoname/:filename

As in the previous requests, the path is relative to the root directory of FidoREST.

**A file** (designated by its name) **published in a file echomail area** (designated by its name) is requested.

![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) Currently FidoREST does not support serving files from local file echomail areas.

However, a redirect to a remote FTP mirror of the designated area is performed.

The request's keyword (for the `abilites` array) is `'fechofile'`.

If the file echomail area's name (not case-sensitive) is unknown, then an error (`404 Not Found`) happens instead of a redirect. The corresponding JSON object (`{"error":"File echomail area was not found."}`) is served.

### GET /echolist

As in the previous requests, the `/echolist` path is relative to the root directory of FidoREST.

It requests **the list of echomail areas and their metadata.**

The request's keyword (for the `abilites` array) is `'echolist'`.

The response is a JSON array; each element of that array corresponds to an echomail area available on the Fidonet system. Such element has the following properties:

* `echotag` — *(string)* name of the echomail area; the name that appears in area lines after `AREA:` (see the section “Area lines” in [FTS-0004.001](http://ftsc.org/docs/fts-0004.001)).

* `passthrough` — *(boolean)* `true` if the Fidonet system works with this area in passthrough mode (i.e. messages of the area are only delivered to the subscribed Fidonet systems, but afterwards they are not stored on this system and thus an archive of messages is not available); `false` if messages are stored on the system.

* `description` — *(string or null)* the echomail area's description (or `null` if the description was not given in the Fidonet system's configuration).

### GET /areadetails/:areaname

As in the previous requests, the path is relative to the root directory of FidoREST.

It requests **detailed metadata of the designated echomail area.**

The request's keyword (for the `abilites` array) is `'areadetails'`.

The response is one of the following JSON objects:

* if the echomail area is not present on the system, `{ notFound: true }`

* if the echomail area works in passthrough mode (i.e. messages of the area are only delivered to the subscribed Fidonet systems, but afterwards they are not stored on the system and thus an archive of messages is not available), `{ passthrough: true }`

* otherwise an object with the following property:
   * `messages` — the number of echomail messages in the designated echomail area.

**Note: ** the response cannot report the number of unread messages because the request is anonymous.

## Testing FidoREST

[![(build testing status)](https://img.shields.io/travis/Mithgol/fidorest/master.svg?style=plastic)](https://travis-ci.org/Mithgol/fidorest)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the FidoREST module).

After that you may run `npm test` (in the directory of the FidoREST module). Only the JS code errors are caught; the code's behaviour is not tested.

## License

MIT license (see the `LICENSE` file).
