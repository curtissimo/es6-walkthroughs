var connect = require('connect'),
    serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8081);

console.log('Listening on port 8081...');
