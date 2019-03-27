const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../mydb.db');

// temporarily hard coded objects
const nmaps = [
    { ip: '77.231.15.95', name: 'nmap1' },
    { id: '55.44.333.22.11', name: 'nmap2' },
    { id: '11.222.33.44', name: 'nmap3' },
];

// get the whole list /api/nmaps
router.get('/', (req, res) => {
    res.send([nmaps]);
});

// create in db
router.post('/', (req,res) => {
    db.run(
        'INSERT INTO scanData VALUES ($ip, $hostname, $port_id, $protocol, $state, $reason, $reason_ttl, $service_name, $service_time, $service_method, $service_conf, $start_time, $stop_time)',
        {
            $ip: req.body.ip,
            $hostname: req.body.hostname,
            $port_id: req.body.port_id,
            $protocol: req.body.protocol,
            $state: req.body.state,
            $reason: req.body.state,
            $reason_ttl: req.body.reason_ttl,     
            $service_name: req.body.service_name,
            $service_method: req.body.service_method,
            $service_conf: req.body.service_conf,
            $start_time: req.body.start_time,
            $stop_time: req.body.stop_time
        },
        (err) => {
            if (err) {
                res.send({message: 'error in router.post(/nmaps)'});
            } else {
                res.send ({message: 'succesfully run router.post(/nmaps)'});
            }
        }
    )
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
// at /api/nmaps/77.231.15.95
router.get('/:ip', (req, res) => {
    // pull from db
    const lookupIP = req.params.ip;
    db.all(
        // SQL query
        'SELECT * FROM scanData WHERE ip=$ip',
        // parameters to pass into SQL query
        {
            $ip: lookupIP,
        },
        (err, rows) => {
            console.log(rows);
        }
    )
    const nmap = nmaps.find(c => c.id === (req.params.ip));
    if (!nmap) res.status(404).send('The given IP address was not found.');
    res.send(nmap)
});

module.exports = router;