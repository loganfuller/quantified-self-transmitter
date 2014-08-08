var restify = require("restify"),
    BleHR = require("heartrate");

const SAMPLES_TO_AVERAGE = 5;

var hrMonitor = new BleHR("cdc3adf858c949a68c91940d91b608ad"),
    client = restify.createJsonClient({
        url: 'http://localhost',
        version: '*'
    });

var bpsBuf = [],
    dataHandler = function(buf) {
        if(bpsBuf.length !== SAMPLES_TO_AVERAGE) {
            bpsBuf.push(parseInt(buf.toString("utf8")));
        } else {
            var bps = 0;
            for(x in bpsBuf) {
                bps += bpsBuf[x];
            }
            bps /= bpsBuf.length;
            bpsBuf = [];
            sendHeartrate(Math.round(bps));
            console.log(bps);
        }
    },
    sendHeartrate = function(bps) {
        client.post('/heartrate', {
            bps: bps,
            bodyLocation: "Chest"
        }, function(err) {
            if(!!err) console.log(err);
        });
    };

hrMonitor.on("data", dataHandler);

