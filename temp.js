
var express = require('express');
var app = express();

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

app.get('/', function(req, res) {
    var r = req.query;
    try {
        insert_sensor(r.device_id, 0, 0, r.temperature_value, r.sequence_number, req.ip);
    } catch (e) {
        res.json(e);
    }
    res.json({"device_id": r.device_id, "status": "ok", "time": new Date()})
});

var server = app.listen(8098, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
