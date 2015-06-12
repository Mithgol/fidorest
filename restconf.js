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

   return setup;
};