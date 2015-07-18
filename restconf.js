var fidoconfig = require('fidoconfig');
var nodelist = require('nodelist');
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

   return setup;
};