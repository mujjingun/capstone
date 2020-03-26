const express = require('express')
const app = express()
const port = 8000

function addFields(ret, req) {
    ret.email = "mujjingun@gmail.com"
    ret.stuno = "20171634"
    let today = new Date()
    let date = today.getFullYear() + '-' 
             + (today.getMonth() + 1).toString().padStart(2, '0') + '-' 
             + today.getDate().toString().padStart(2, '0')
    let time = today.getHours().toString().padStart(2, '0') + ":" 
             + today.getMinutes().toString().padStart(2, '0') + ":" 
             + today.getSeconds().toString().padStart(2, '0')
    ret.time = date + ' ' + time;
    var ip = req.ip.split(':')
    ip = ip[ip.length - 1]
    ret.ip = ip
}

app.get('/get', function(req, res) {
    var ret = JSON.parse(JSON.stringify(req.query))
    addFields(ret, req)
    res.json(ret)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post('/', function(req, res, next) {
    var ret = JSON.parse(JSON.stringify(req.body))
    addFields(ret, req)
    res.json(ret)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
