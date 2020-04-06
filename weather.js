
const https = require('https')
var parseString = require('xml2js').parseString;

mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

function insert_sensor(device, unit, type, value, seq, ip) {
  obj = {};
  obj.seq = seq;
  obj.device = device;
  obj.unit = unit;
  obj.type = type;
  obj.value = value;
  obj.ip = ip.replace(/^.*:/, '')

  var query = connection.query('insert into sensors set ?', obj, function(err, rows, cols) {
    if (err) throw err;
    console.log("database insertion ok= %j", obj);
  });
}

function insert() {
    const options = {
        hostname: 'www.kma.go.kr',
        port: 443,
        path: `/wid/queryDFSRSS.jsp?zone=4113552000`,
        method: 'GET'
    }

    new Promise((resolve, reject) => {
        const call = https.request(options, response => {
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        })

        call.on('error', error => {
            reject("Error")
        })

        call.end()
    }).then((data) => {
        parseString(data, function (err, result) {
            temp = result["rss"]["channel"][0]["item"][0]["description"][0]["body"][0]["data"][0]["temp"][0];
            insert_sensor(0, 0, 0, temp, 0, "localhost");
        });
    })
}

setInterval(insert, 5000);
