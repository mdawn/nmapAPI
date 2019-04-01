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
        'INSERT INTO scanData VALUES ($ip, $hostname, $host_status, $port_id1, $port_id2, $port_id3, port_id4, port_id5, $protocol1, $protocol2, $protocol3, $protocol4, $protocol5, $port_state1, $port_state2, $port_state3, $port_state4, $port_state5, $service1, $service2, $service3, $service4, $service5, $start_time, $stop_time)',
        {
            $ip: req.body.ip,
            $hostname: req.body.hostname,
            $host_status: req.body.state,
            $port_id1: req.body.port_id,
            $port_id2: req.body.port_id,
            $port_id3: req.body.port_id,
            $port_id4: req.body.port_id,
            $port_id5: req.body.port_id,
            $protocol1: req.body.protocol,
            $protocol2: req.body.protocol,
            $protocol3: req.body.protocol,
            $protocol4: req.body.protocol,
            $protocol5: req.body.protocol,
            $port_state1: req.body.state,
            $port_state2: req.body.state,
            $port_state3: req.body.state,
            $port_state4: req.body.state,
            $port_state5: req.body.state,
            $service1: req.body.name,
            $service2: req.body.name,
            $service3: req.body.name,
            $service4: req.body.name,
            $service5: req.body.name,     
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