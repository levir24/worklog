const express = require('express');
const bodyParser = require('body-parser');
const authroute = require('./auth.route')
const tableroute = require('./tables.route'); 

const BASEURL = '/worklog/api'


var TEST = false
var AUTH = true

// Express app

for (var arg in process.argv) {
    if (process.argv[arg] == '--noauth') AUTH=false
    if (process.argv[arg] == '--test') { TEST = true }
}

// ------------------- schedules ----------------------

const app = express();

if (AUTH) app.use(authroute)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use(BASEURL+'/uploads',express.static('uploads'));
app.use(BASEURL+'/api/uploads',express.static('uploads'));    // For downloading
app.use(BASEURL+'/tables', tableroute);


 // ---------------------- Schedules -----------------------


 app.get(BASEURL+'/server/time', function (req, res) { res.json({ servtime:  new Date().getTime() }) })
/*
 app.get(BASEURL+'/server/schedules/:floor', function (req, res) {
    get_schedules(req.params.floor).then( list => res.json(list) )
 })

 app.put(BASEURL+'/server/schedules', function (req, res) {
    DIRTY = true
    res.json(req.body)
 })

 app.post(BASEURL+'/server/schedules/run', function (req, res) {  
    schedules.run_sched(req.body)
    res.json(req.body.name)
 })
*/

app.post(BASEURL+'/server/shutdown', function (req, res) {      // Shutdown  server
    res.json({ msg:  'shutdown'})
    process.exit(1)
    })

app.use('/worklog',express.static('dist'));
app.get('/worklog*', function (req, res) { res.redirect('/worklog') })

let PORT = 8040;


app.listen(PORT, () => {
    console.log('Worklog is up and running on port number ' + PORT+ ' on '+new Date());
})