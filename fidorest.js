var path = require('path');
var express = require('express');
var extend = require('extend');
var configReader = require('./restconf.js');
var manifest = require('./package.json');

var defaultsFidoREST = {
   configFilePath: path.join(__dirname, 'fidorest.conf')
};

module.exports = function(optionsFidoREST){
   var app = express();

   var options = extend({}, defaultsFidoREST, optionsFidoREST);
   var setupFidoREST = configReader(options);

   app.get('/', function(req, res){
      res.type('application/json;charset=utf-8');
      res.send(JSON.stringify({
         address: setupFidoREST.address,
         sys: setupFidoREST.SysOp,
         soft: 'FidoREST ' + manifest.version
      }));
   });

   return app;
};