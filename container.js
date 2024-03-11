const dependable = require('dependable');
const path = require('path');
const container = dependable.container();

const myModules = [
    ['_', 'lodash'],
    ['path', 'path'],
    ['User', './models/user'],
    ['moment', 'moment'],
    ['passport', 'passport'],
    ['bcrypt', 'bcrypt-nodejs'],
    ['formidable', 'formidable'],
    ['axios', 'axios'],
    ['xml2js', 'xml2js']
];

myModules.forEach(function(val){
    
    container.register(val[0], function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register(container, function(){
    return container;
});

module.exports = container;