
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
    if (!err) {
        console.log("database insertion ok= %j", obj);
    }
  });
}

app.get('/add', function(req, res) {
    var r = req.query;
    insert_sensor(r.device_id, 0, 0, r.temperature_value, r.sequence_number, req.ip);
    res.json({"device_id": r.device_id, "status": "ok", "time": new Date()})
});

app.get('/get', function(req, res) {
    var r = req.query;
    if (r.device_id === "empty" || r.device_id === undefined) {
        var qstr = 'select * from sensors';
        new Promise((resolve, reject) => {
            connection.query(qstr, r.device_id, function(err, rows, cols) {
                if (!err) {
                    resolve(rows);
                }
                reject("Error")
            });
        }).then((data) => {
            res.json(data)
        }).catch((e) => {
            res.json(e);
        });
    }
    else {
        var qstr = 'select * from sensors where device = ?';
        new Promise((resolve, reject) => {
            connection.query(qstr, r.device_id, function(err, rows, cols) {
                if (!err) {
                    resolve(rows);
                }
                reject("Error")
            });
        }).then((data) => {
            res.json(data)
        }).catch((e) => {
            res.json(e);
        });
    }
});

var server = app.listen(8098, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
