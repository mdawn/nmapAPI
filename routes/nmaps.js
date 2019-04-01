const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');

// get the whole list /api/nmaps
router.get('/', (req, res) => {
    console.log('get /');
    res.send([nmaps]);
});

// create in db
router.post('/submit_file', (req,res) => { 
    // const getFile = req.params.;
    console.log('post read');
    console.log(req);

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