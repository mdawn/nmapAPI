const nmaps = require('./routes/nmaps');
const scanUtil = require('./models/scans');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');
const fs = require('fs')
const xml2js = require('xml2js');
const util = require('util');

// middleware to process json in request pipeline
app.use(express.json());
app.use('/api/nmaps', nmaps);
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled')
}

// parse xml to js object
var parser = new xml2js.Parser();

// read local file for testing purposes
fs.readFile(__dirname + '/samples/nmap.results.xml', function(err, data) {
  parser.parseString(data, handleXMLString);
});

// parse xml and writes entries to db
function handleXMLString (err, result) {
  let scans = result.nmaprun.host;
  // loop thru arrays and recast into digestable bits
  scans.forEach(parseAndWriteToDB);
  function parseAndWriteToDB (scan) {
    console.log('\n\n');

    console.log('scan:')
    // make easy to view
    console.log(JSON.stringify(scan));
    const myIP = scan.address[0]['$'].addr;
    // if hostname has "$" and "name" look past name to get value
    let hostname;
    if (scan.hostnames[0].hostname && scan.hostnames[0].hostname[0]['$'].name) {
      hostname = scan.hostnames[0].hostname[0]['$'].name;
      // otherwise take "\n" as value
    } else {
      hostname = scan.hostnames[0];
    }
    const hostStatus = scan.status[0]['$'].state;
    const portID1 = scan.ports[0].port[0]['$'].portid;
    const portID2 = scan.ports[0].port[1]['$'].portid;
    const portID3 = scan.ports[0].port[2]['$'].portid;
    const portID4 = scan.ports[0].port[3]['$'].portid;
    const portID5 = scan.ports[0].port[4]['$'].portid;
    const protocol1 = scan.ports[0].port[0]['$'].protocol;
    const protocol2 = scan.ports[0].port[1]['$'].protocol;
    const protocol3 = scan.ports[0].port[2]['$'].protocol;
    const protocol4 = scan.ports[0].port[3]['$'].protocol;
    const protocol5 = scan.ports[0].port[4]['$'].protocol;
    const portState1 = scan.ports[0].port[0].state[0]['$'].state;
    const portState2 = scan.ports[0].port[1].state[0]['$'].state;
    const portState3 = scan.ports[0].port[2].state[0]['$'].state;
    const portState4 = scan.ports[0].port[3].state[0]['$'].state;
    const portState5 = scan.ports[0].port[4].state[0]['$'].state;
    const service1 = scan.ports[0].port[0].service[0]['$'].name;
    const service2 = scan.ports[0].port[1].service[0]['$'].name;
    const service3 = scan.ports[0].port[2].service[0]['$'].name;
    const service4 = scan.ports[0].port[3].service[0]['$'].name;
    const service5 = scan.ports[0].port[4].service[0]['$'].name;
    const startTime = scan.$.starttime;
    const stopTime = scan.$.endtime;

    scanUtil.writeScanToDB(db, {
      'ip': myIP,
      'hostname': hostname,
      'host_status': hostStatus,
      'port_id1': portID1,
      'port_id2': portID2,
      'port_id3': portID3,
      'port_id4': portID4,
      'port_id5': portID5,
      'protocol1': protocol1,
      'protocol2': protocol2,
      'protocol3': protocol3,
      'protocol4': protocol4,
      'protocol5': protocol5,
      'port_state1': portState1,
      'port_state2': portState2,
      'port_state3': portState3,
      'port_state4': portState4,
      'port_state5': portState5,
      'service1': service1,
      'service2': service2,
      'service3': service3,
      'service4': service4,
      'service5': service5,
      'start_time': startTime,
      'stop_time': stopTime
    });
  }   
}

const port = process.env.PORT || 5010;
app.listen(port, () => console.log(`Listening on port ${port}...`));
