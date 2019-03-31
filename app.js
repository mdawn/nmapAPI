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
      const protocol1 = scan.ports[0].port[0]['$'].protocol;
      const hostStatus = scan.status[0]['$'].state;
      const portState1 = scan.ports[0].port[0].state[0]['$'].state;
      // const statusStateReason = scan.status[0]['$'].reason;
      // const portStateReason = scan.ports[0].port[0].state[0]['$'].reason;
      // const statusStateReasonTTL = scan.status[0]['$'].reason_ttl;
      // const portStateReasonTTL = scan.ports[0].port[0].state[0]['$'].reason_ttl;
      const startTime = scan.$.starttime;
      const stopTime = scan.$.endtime;


      console.log(`ip is ${myIP}`);
      console.log(`hostname is ${JSON.stringify(hostname)}`);
      console.log(`host status is ${hostStatus}`);
      console.log(`port_id 1 is ${portID1}`);
      //
      //
      console.log(`protocol 1 is ${protocol1}`);
      // 
      //
      //
      console.log(`port state 1 is ${portState1}`);
      //
      //
      // service 1
      //
      //
      console.log(`host start time is ${startTime}`);
      console.log(`host stop time is ${stopTime}`);


      // X console.log(`port state reason_ttl is ${portStateReasonTTL}`);
      // X console.log(`status state reason_ttl is ${statusStateReasonTTL}`);
      // X console.log(`port state reason is ${portStateReason}`);
      // X console.log(`status state reason is ${statusStateReason}`);
      
      

      /* writeScanToDB({
        'ip': myIP,
        'hostname': hostname,
        'port_id': portID,
        'protocol': protocol,
        'status state': statusState,
        'port state': portState,
        'status state reason': statusStateReason,
        'port state reason': portStateReason,
        'status state reason_ttl': statusStateReasonTTL,
        'port state reason_ttl': portStateReasonTTL,
        'host start time': startTime,
        'host stop time': stopTime
      });*/
    } 
    
      

      console.log('Done');
  });
});

const port = process.env.PORT || 5010;
app.listen(port, () => console.log(`Listening on port ${port}...`));