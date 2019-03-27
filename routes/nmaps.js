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
    console.log("lookupIP: " + lookupIP)
    db.all(
        // SQL query
        'SELECT * FROM hosts WHERE ip=$ip',
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