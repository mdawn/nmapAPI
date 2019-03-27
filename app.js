const nmaps = require('./routes/nmaps');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

var fs = require('fs'),
    xml2js = require('xml2js');
    var util = require('util');

var parser = new xml2js.Parser();

// middleware to process json in request pipeline
app.use(express.json());
app.use('/api/nmaps', nmaps);
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled')
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// parse xml to JSON
fs.readFile(__dirname + '/samples/nmap.results.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.log(util.inspect(JSON.stringify(result), false, null));
        console.log('Done');
    });
});