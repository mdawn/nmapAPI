const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const fs = require('fs');


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



db.serialize(function (newScan) {
    db.run('CREATE TABLE if not exists hosts (ip VARCHAR(16) PRIMARY KEY NOT NULL, mac VARCHAR(18), hostname VARCHAR(129), protocol VARCHAR(5) DEFAULT `ipv4`, os_name TEXT, os_family TEXT, os_accuracy INTEGER, os_gen TEXT, last_update TIMESTAMP, state VARCHAR(8) DEFAULT `down`, mac_vendor TEXT, whois TEXT)')
    var stmt = db.prepare('INSERT INTO hosts VALUES (?,?,?,?,?,?,?,?,?,?)')
  
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
    }
  
    stmt.finalize()
  
    db.each('SELECT rowid AS id, ip FROM hosts', function (err, row) {
      console.log(row.id + ': ' + row.ip, row.mac, row.hostname, row.protocol, row.os_name, row.os_family, row.os_accuracy, row.os_gen, row.last_update, row.state, row.mac_vendor, row.whois)
    })
  })
  
  db.close()  