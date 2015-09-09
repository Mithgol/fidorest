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
         soft: 'FidoREST ' + manifest.version,
         abilities: ['freqlist', 'freq', 'echolist', 'fechofile'],
         publicKey: setupFidoREST.publicKeyArmored
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

   app.get('/freq/:filename', function(req, res){
      var target = req.params.filename;
      var lcTarget = target.toLowerCase();
      var targetPath;

      async.detectSeries(
         setupFidoREST.freqDirs,
         function findFileFromDir(someFreqDir, directoryProcessed){
            var resolvedPath = path.resolve(__dirname, someFreqDir);
            fs.readdir(resolvedPath, function(err, filenames){
               if( err ) return directoryProcessed(false);

               async.detectSeries(
                  filenames,
                  function processFilename(someFilename, fileDone){
                     var lcFilename = someFilename.toLowerCase();
                     if( lcTarget !== lcFilename ){
                        return fileDone(false);
                     }
                     targetPath = path.resolve(
                        resolvedPath, someFilename
                     );
                     fileDone(true);
                  },
                  function filenamesProcessed(wereThey){
                     return directoryProcessed(wereThey);
                  }
               );
            });
         },
         function gotFileFromDirs(wasFound){
            if( !wasFound ){
               res.status(404);
               res.type('application/json;charset=utf-8');
               res.send(JSON.stringify({
                  error: 'File not found.'
               }));
               return;
            }
            res.sendFile(targetPath);
         }
      );
   });

   app.get('/echolist', function(req, res){
      var areaNames = setupFidoREST.areas.getAreaNames().map(function(aName){
         return {
            echotag: aName,
            passthrough: setupFidoREST.areas[aName].passthrough,
            description: setupFidoREST.areas[aName].description
         };
      });
      res.type('application/json;charset=utf-8');
      res.send(JSON.stringify( areaNames ));
   });

   app.get('/fileecho/:fechoname/:filename', function(req, res){
      var fechoname = req.params.fechoname;
      var filename = req.params.filename;
      var mirrored = setupFidoREST.feFTPMirrored;
      if( mirrored === null ){
         res.status(404);
         res.type('application/json;charset=utf-8');
         res.send(JSON.stringify({
            error: 'File echomail area was not found.'
         }));
         return;
      }
      var addr = mirrored[ fechoname.toLowerCase() ];
      if( typeof addr === 'undefined' ){
         res.status(404);
         res.type('application/json;charset=utf-8');
         res.send(JSON.stringify({
            error: 'File echomail area was not found.'
         }));
         return;
      }
      res.redirect(addr + filename);
   });

   return app;
};