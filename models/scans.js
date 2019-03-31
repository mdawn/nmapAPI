const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const fs = require('fs')

// import db schema from sql file
var exec = require('child_process').exec; 
spawn = require("child_process").spawn
child = spawn("sqlite3", ["mydb.db"])

child = exec('cat ./models/schema.sql | sqlite3 mydb.db', (error) => {
    console.log("mydb.db created")    
    if (error !== null) {
            console.log('something happened with db' + error);
        }
    }
);

fs.createReadStream("./models/schema.sql").pipe(child.stdin)

function writeScanToDB (scanData) {
    // TODO
    console.log(`writing ${JSON.stringify(scanData)}`);
}

module.exports = {
    writeScanToDB: writeScanToDB
};