const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');

// get the whole list /api/nmaps
router.get('/', (req, res) => {
    res.send([nmaps]);
});

// create in db
router.post('/', (req,res) => { 
    // const getFile = req.params.;
    console.log("lookupIP: " + lookupIP)
    db.run(
        'INSERT INTO scanData VALUES ($ip, $hostname, $port_id, $protocol, $state, $port_reason, $port_reason_ttl, $start_time, $stop_time)',
        {
            $ip: req.body.ip,
            $hostname: req.body.hostname,
            $port_id: req.body.port_id,
            $protocol: req.body.protocol,
            $state: req.body.state,
            $port_reason: req.body.state,
            $port_reason_ttl: req.body.reason_ttl,     
            $start_time: req.body.start_time,
            $stop_time: req.body.stop_time
        },
        (err) => {
            if (err) {
                res.send({message: 'error in router.post(/nmaps)'});
            } else {
                res.send ({message: 'succesfully ran router.post(/nmaps)'});
            }
        }
    ); 
    
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const nmap = {
        id: nmaps.length + 1,
        name: req.body.name
    };
    nmaps.push(nmap);
    res.send(nmap);
});

// get a single nmap item by ip as a string
router.get('/:ip', (req, res) => {
    // pull from db
    const lookupIP = req.params.ip;
    console.log("lookupIP: " + lookupIP)
    db.all(
        // SQL query
        'SELECT * FROM scanData WHERE ip=$ip',
        // parameters to pass into SQL query
        {
            $ip: lookupIP,
        }, 
        (err, rows) => {
            console.log(rows)
            console.log(err);
            // send response
            const nmap = rows.find(c => c.ip === (req.params.ip));
            if (!nmap) res.status(404).send('The given IP address was not found.');
            res.send(nmap)
        }
    )   
});

module.exports = router;

/* db.serialize(function (newScan) { 
    db.run('CREATE TABLE if not exists hosts (result_id INTEGER, ip VARCHAR(16) PRIMARY KEY, hostname VARCHAR(129), port_id TEXT, protocol VARCHAR(5) DEFAULT `ipv4`, state VARCHAR(20) DEFAULT `down`, port_reason TEXT, port_reason_ttl TEXT, start_time TIMESTAMP, stop_time TIMESTAMP)')
    var stmt = db.prepare('INSERT INTO hosts VALUES (?,?,?,?,?,?,?,?,?,?)')
  
    for (var i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i)
    }
  
    stmt.finalize()
  
    db.each('SELECT rowid AS id, ip FROM scanData', function (err, row) {
      console.log(row.id + ': ' + row.result_id, row.ip, row.hostname, row.port_id, row.protocol, row.state, row.reason, row.reason_ttl, row.service_name, row.service_method, row.service_conf, row.start_time, row.stop_time)
    })
  }) 
  db.close()  */