const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:');
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

function writeScanToDB (db, scanData) {
    
    db.serialize(function() {    
        var stmt = db.prepare("INSERT INTO scanData VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        stmt.run(scanData.ip, scanData.hostname, scanData.host_status, scanData.port_id1, scanData.port_id2, scanData.port_id3, scanData.port_id4, scanData.port_id5, scanData.protocol1, scanData.protocol2, scanData.protocol3, scanData.protocol4, scanData.protocol5, scanData.port_state1, scanData.port_state2, scanData.port_state3, scanData.port_state4, scanData.port_state5, scanData.service1, scanData.service2, scanData.service3, scanData.service4, scanData.service5, scanData.start_time, scanData.stop_time);
        stmt.finalize();

    });
}; 

module.exports = {
    writeScanToDB: writeScanToDB
}