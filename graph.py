/*
 * 2018/3/23 Kyuho Kim
 * ekyuho@gmail.com
 * GET으로 호출하는 경우.
 * http://localhost:8082/graph
 */
var express = require('express')
var app = express()
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();


app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');

    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;

      var data = "";
      var comma = ""
      for (var i=0; i< rows.length; i++) {
         r = rows[i];
         data += comma + "[new Date(2017,04-1,"+ r.id +",00,38),"+ r.value +"]";
         comma = ",";
      }
      var header = "data.addColumn('date', 'Date/Time');"
      header += "data.addColumn('number', 'Temp');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);

      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  });
})

var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

const https = require('https')
const xml = require("xml-parse");
function intervalFunc() {
    const options = {
        hostname: 'www.kma.go.kr',
        port: 443,
        path: '/wid/queryDFSRSS.jsp?zone=4113552000',
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
    }).then(function(data) {
        var parsedXML = xml.parse(data);
        var temp = parsedXML[0].childNodes[0].childNodes[6].childNodes[5].childNodes[0].childNodes[2];
        console.log(temp)
        var query = connection.query(`insert into sensors (type, device, unit, ip, value) values ('T', 102, 0, '192.168.1.1', ${temp})`,
            function(err, rows, cols) {
                if (err) throw err;
                console.log("done");
                process.exit();
            });
    })
}

setInterval(intervalFunc, 5000);
