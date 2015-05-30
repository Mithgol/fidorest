var simteconf = require('simteconf');

module.exports = function(configOptions){
   var setup = {};
   var configFidoREST = simteconf(configOptions.configFilePath, {
      skipNames: ['//', '#']
   });

   setup.address = configFidoREST.last('Address'); // or `null`
   setup.SysOp = configFidoREST.last('SysOp'); // or `null`

   return setup;
};