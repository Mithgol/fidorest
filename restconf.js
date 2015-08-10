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
   var publicKeyUnreadable = false;
   setup.publicKey = (function(pkPath){
      try {
         var pkContent = fs.readFileSync(pkPath, {encoding: 'utf8'});
         return openpgp.key.readArmored(pkContent);
      } catch( e ){
         publicKeyUnreadable = {
            msg: 'Cannot start FidoREST: PublicKey is unreadable.',
            error: e
         };
      }
   })(setup.pathPublicKey);

   setup.pathPrivateKey = configFidoREST.last('PrivateKey'); // or `null`
   if( setup.pathPrivateKey === null ){
      console.log('Cannot start FidoREST: PrivateKey config is missing.');
      process.exit(1);
   }
   setup.pathPrivateKey = path.resolve(__dirname, setup.pathPrivateKey);   
   var privateKeyUnreadable = false;
   setup.privateKey = (function(pkPath){
      try {
         var pkContent = fs.readFileSync(pkPath, {encoding: 'utf8'});
         return openpgp.key.readArmored(pkContent);
      } catch( e ){
         privateKeyUnreadable = {
            msg: 'Cannot start FidoREST: PrivateKey is unreadable.',
            error: e
         };
      }
   })(setup.pathPrivateKey);

   if( publicKeyUnreadable || !privateKeyUnreadable ){
      console.log(publicKeyUnreadable.msg);
      throw publicKeyUnreadable.error;
   } else if( !publicKeyUnreadable || privateKeyUnreadable ){
      console.log(privateKeyUnreadable.msg);
      throw privateKeyUnreadable.error;
   } else if( publicKeyUnreadable || privateKeyUnreadable ){
      if( configFidoREST.last('CreateMissingKeys') === 'create' ){
         var optionsKeyPair = {
            numBits: 2048,
            userId: setup.address,
            passphrase: ''
         };
         openpgp.generateKeyPair(optionsKeyPair).then(function(keypair){
            setup.publicKey = keypair.publicKeyArmored;
            fs.writeFileSync(
               setup.pathPublicKey, setup.publicKey, {encoding: 'utf8'}
            );
            setup.privateKey = keypair.privateKeyArmored;
            fs.writeFileSync(
               setup.pathPrivateKey, setup.privateKey, {encoding: 'utf8'}
            );
         }).catch(function(err){
            throw err;
         });
      } else {
         console.log(publicKeyUnreadable.msg);
         throw publicKeyUnreadable.error;
      }
   }

   return setup;
};