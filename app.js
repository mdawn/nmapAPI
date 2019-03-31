const nmaps = require('./routes/nmaps');
const writeScanToDB = require('./models/scans').writeScanToDB;
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
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

fs.readFile(__dirname + '/samples/nmap.results.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
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
      const portID1 = scan.ports[0].port[0]['$'].portid;
      const portID2 = scan.ports[0].port[1]['$'].portid;
      const portID3 = scan.ports[0].port[2]['$'].portid;
      const protocol1 = scan.ports[0].port[0]['$'].protocol;
      const protocol2 = scan.ports[0].port[1]['$'].protocol;
      const protocol3 = scan.ports[0].port[2]['$'].protocol;
      const hostStatus = scan.status[0]['$'].state;
      const portState1 = scan.ports[0].port[0].state[0]['$'].state;
      const portState2 = scan.ports[0].port[1].state[0]['$'].state;
      const portState3 = scan.ports[0].port[2].state[0]['$'].state;
      const service1 = scan.ports[0].port[0].service[0]['$'].name;
      const service2 = scan.ports[0].port[1].service[0]['$'].name;
      const service3 = scan.ports[0].port[2].service[0]['$'].name;
      const startTime = scan.$.starttime;
      const stopTime = scan.$.endtime;


      console.log(`ip is ${myIP}`);
      console.log(`hostname is ${JSON.stringify(hostname)}`);
      console.log(`host status is ${hostStatus}`);
      console.log(`port_id 1 is ${portID1}`);
      console.log(`port_id 2 is ${portID2}`);
      console.log(`port_id 3 is ${portID3}`);
      console.log(`protocol 1 is ${protocol1}`);
      console.log(`protocol 2 is ${protocol2}`);
      console.log(`protocol 3 is ${protocol3}`);
      //
      console.log(`port state 1 is ${portState1}`);
      console.log(`port state 2 is ${portState2}`);
      console.log(`port state 3 is ${portState3}`);
      console.log(`service 1 is ${service1}`);
      console.log(`service 2 is ${service2}`);
      console.log(`service 3 is ${service3}`);
      console.log(`host start time is ${startTime}`);
      console.log(`host stop time is ${stopTime}`);
      
      

      writeScanToDB({
        'ip': myIP,
        'hostname': hostname,
        'host status': hostStatus,
        'port_id 1': portID1,
        'port_id 2': portID2,
        'port_id 3': portID3,
        'protocol 1': protocol1,
        'protocol 2': protocol1,
        'protocol 3': protocol1,
        'port state 1': portState1,
        'port state 2': portState2,
        'port state 3': portState3,
        'service 1': service1,
        'service 2': service2,
        'service 3': service3,
        'host start time': startTime,
        'host stop time': stopTime
      });
    } 
    
      

      console.log('Done');
  });
});

const port = process.env.PORT || 5010;
app.listen(port, () => console.log(`Listening on port ${port}...`));