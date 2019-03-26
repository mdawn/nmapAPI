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


// docs at https://www.npmjs.com/package/sqlite
/* var check;
db.serialize(function () {
    db.run('CREATE TABLE if not exists lorem (info TEXT)')
    var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
  
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
    }
  
    stmt.finalize()
  
    db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
      console.log(row.id + ': ' + row.info)
    })
  })
  
  db.close() */