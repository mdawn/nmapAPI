const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// scan model schema or whatever here
const Scan = sqlite.model('Scan', new sqlite.Schema({
    
}))

// docs at https://www.npmjs.com/package/sqlite

db.serialize(function () {
    db.run('CREATE TABLE lorem (info TEXT)')
    var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
  
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
    }
  
    stmt.finalize()
  
    db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
      console.log(row.id + ': ' + row.info)
    })
  })
  
  db.close()