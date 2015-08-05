var fs = require('fs');
var path = require('path');
var fidoconfig = require('fidoconfig');
var nodelist = require('nodelist');
var openpgp = require('openpgp');
var simteconf = require('simteconf');

module.exports = function(configOptions){
   var setup = {};
   var configFidoREST = simteconf(configOptions.configFilePath, {
      skipNames: ['//', '#']
   });

   setup.address = configFidoREST.all('Address'); // or `null`
   setup.SysOp = configFidoREST.last('SysOp'); // or `null`

   setup.freqDirs = configFidoREST.all('FreqDir'); // or `null`
   if( setup.freqDirs === null ) setup.freqDirs = [];

   // Read HPT areas:
   setup.areas = fidoconfig.areas(configFidoREST.last('AreasHPT'), {
      encoding: configFidoREST.last('EncodingHPT') || 'utf8'
   });

   // Read nodelist from ZIP:
   try {
      var ZIPNodelist = configFidoREST.last('ZIPNodelist');
      setup.nodelist = nodelist(ZIPNodelist, { zip: true });
   } catch(e) {
      setup.nodelist = null;
   }

   setup.pathPublicKey = configFidoREST.last('PublicKey'); // or `null`
   if( setup.pathPublicKey === null ){
      console.log('Cannot start FidoREST: PublicKey config is missing.');
      process.exit(1);
   }
   setup.pathPublicKey = path.resolve(__dirname, setup.pathPublicKey);
   setup.publicKey = (function(pkPath){
      try {
         var pkContent = fs.readFileSync(pkPath, {encoding: 'utf8'});
         return openpgp.key.readArmored(pkContent);
      } catch( e ){
         console.log('Cannot start FidoREST: PublicKey is unreadable.');
         throw e;
      }
   })(setup.pathPublicKey);

   setup.pathPrivateKey = configFidoREST.last('PrivateKey'); // or `null`
   if( setup.pathPrivateKey === null ){
      console.log('Cannot start FidoREST: PrivateKey config is missing.');
      process.exit(1);
   }
   setup.pathPrivateKey = path.resolve(__dirname, setup.pathPrivateKey);
   setup.privateKey = (function(pkPath){
      try {
         var pkContent = fs.readFileSync(pkPath, {encoding: 'utf8'});
         return openpgp.key.readArmored(pkContent);
      } catch( e ){
         console.log('Cannot start FidoREST: PrivateKey is unreadable.');
         throw e;
      }
   })(setup.pathPrivateKey);

   return setup;
};