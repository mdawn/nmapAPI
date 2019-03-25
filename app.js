// const fs = require('fs');

// asynchronous file reader which returns array of strings
// TODO: read nmap instead of path
/* fs.readdir('./', function(err, files) {
    if (err) console.log('Error', err);
    else console.log('Result', files);
});*/
const nmaps = require('./routes/nmaps');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

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
