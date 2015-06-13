var fs = require('fs');
var path = require('path');
var async = require('async');
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

   app.get('/freqlist', function(req, res){
      var freqFiles = [];
      var usedFilenames = [];
      async.eachSeries(
         setupFidoREST.freqDirs,
         function getFreqFilesFromDir(someFreqDir, directoryProcessed){
            var resolvedPath = path.resolve(__dirname, someFreqDir);
            fs.readdir(resolvedPath, function(err, filenames){
               if( err ) return directoryProcessed();

               async.eachSeries(
                  filenames,
                  function processFilename(someFilename, fileDone){
                     var lcFilename = someFilename.toLowerCase();
                     if( usedFilenames.indexOf(lcFilename) > -1 ){
                        return fileDone();
                     }
                     var resolvedName = path.resolve(
                        resolvedPath, someFilename
                     );
                     fs.stat(resolvedName, function(err, fileStats){
                        if( err ) return fileDone();
                        if(!( fileStats.isFile() )) return fileDone();

                        usedFilenames.push(lcFilename);
                        freqFiles.push({
                           name: someFilename,
                           size: fileStats.size,
                           mtime: fileStats.mtime.getTime()
                        });
                        return fileDone();
                     });
                  },
                  function filenamesProcessed(){
                     return directoryProcessed();
                  }
               );
            });
         },
         function gotFreqFilesFromDirs(){
            res.type('application/json;charset=utf-8');
            res.send(JSON.stringify( freqFiles ));
         }
      );
   });

   return app;
};