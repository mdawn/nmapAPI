const fs = require('fs');

// asynchronous file reader which returns array of strings
// TODO: read nmap instead of path
fs.readdir('./', function(err, files) {
    if (err) console.log('Error', err);
    else console.log('Result', files);
});

// emitting events from logger 
const EventEmitter = require('events');

const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
    console.log('Listener called', arg);
});

logger.log('message');

// API the non-express way
const http = require('http');

const server = http.createServer((req, res) => {
    // work with request or response object
    if (req.url === '/') {
        // define the response
        res.write('Hello World');
        res.end();
    }
    // endpoint that responds to http://localhost:3000/api/courses
    if (req.url === '/api/courses') {
        // return a json array of ints (could be db stuff, etc.) as a string
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});
server.listen(3000);

console.log('Listening on port 3000...');

// sqlite npm package - A wrapper library that adds ES6 promises and SQL-based migrations API to sqlite3 (docs).
// docs at https://www.npmjs.com/package/sqlite

var _ = require('sqlite');


