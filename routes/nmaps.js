const express = require('express');
const router = express.Router();

// temporarily hard coded objects
const nmaps = [
    { id: '77.231.15.95', name: 'nmap1' },
    { id: '55.44.333.22.11', name: 'nmap2' },
    { id: '11.222.33.44', name: 'nmap3' },
];

// get the whole list /api/nmaps
router.get('/', (req, res) => {
    res.send([nmaps]);
});

// create the list in db
router.post('/', (req,res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    // TODO: shove in db
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
    // TODO: pull from db
    const nmap = nmaps.find(c => c.id === (req.params.ip));
    if (!nmap) res.status(404).send('The given IP address was not found.');
    res.send(nmap)
});

module.exports = router;