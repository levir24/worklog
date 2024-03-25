const express = require('express');
const router = express.Router();
const tables = require('./tables')
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs    = require('fs');

var FILEPATH = 'uploads/'

const USERNAME = process.env.USERNAME || "system"
const PASSWORD = process.env.PASSWORD || "system8623"
const SECRET = process.env.SECRET || 'imononesideimontheother'

function load_config(filename) {
    STATUS = true
    try {
        var data = fs.readFileSync(filename)
        return(data.toString())
    } catch(e) { STATUS = false; return('[]') }
}

function save_config(filename,data) {
    try { fs.mkdirSync(FILEPATH+'config') } catch(err)  { }
    var file = fs.openSync(filename,'w')
    fs.writeSync(file,data)
    fs.closeSync(file)
    return(0)
}

function app_put(req, res) {
    //console.log("putting ",req.body)
    var TABLE = req.params.table       
    var item = tables.update_item(TABLE,req.body)
    res.json(item)
 }

 function app_add(req, res) {
    //console.log("adding ",req.body)
    var TABLE = req.params.table        
    var item = tables.add_item(TABLE,req.body)
    res.json(item)
 }

 function app_delete (req, res) {
    var TABLE = req.params.table       
    table = tables.delete_item(TABLE,req.params.id)
    res.json(table)
 }


function app_get(req, res) {
    var TABLE = req.params.table       
    var table=tables.get_table(TABLE)
    if (table) res.json(table)
    else res.json([])
}

function app_status(req, res) {
    var status=tables.get_status()
    res.json(status)
}

function app_saveall(req, res) {
    tables.save_all_tables()
    res.json("")
}

function app_reset(req, res) {
    tables.reset_tables()
    res.json("")
}

function app_findby(req, res) {
    var list = tables.findby(req.params.table,req.params.key,req.params.value)
    res.json(list)
 }

 // User endpoints

const app_login =  (req,res) => {
    var body = req.body 
    if (body.username == USERNAME && body.password == PASSWORD) { 
      var payload = { username: USERNAME, roles: ["admin"] }
      var token = jwt.sign(payload, SECRET) //, { expiresIn: EXPIRES });
      console.log("token",token)
      res.send({ username: payload.username, roles: payload.roles, token: token }) 
      }
    else {
      try {
        var users = JSON.parse(load_config(FILEPATH+'config/users.json'))
        var user = users.filter(el => el.username === body.username)[0]
        if (user && bcrypt.compareSync(body.password, user.password)) { 
          var payload = { username: user.username, roles: user.roles }
          var token = jwt.sign(payload, SECRET) //, { expiresIn: EXPIRES });
          res.send({ username: payload.username, roles: payload.roles, token: token }) 
          }
      else
          res.status(401).send({ username: 'NotLoggedIn',token: null })
      } catch(err) { res.json({ error: err})}
    }
  }

function app_create_user(req, res) {
  var users = JSON.parse(load_config(FILEPATH+'config/users.json'))
  var max = 0
  for ( var item of users) { if (max < item.id) max = item.id }
  var newuser = { username: req.body.username, roles: [req.body.role], 
    password: bcrypt.hashSync(req.body.password,8), id: max+1 }
  users.push(newuser)
  save_config(FILEPATH+'config/users.json',JSON.stringify(users))
  res.json(newuser)
}

// Backup =========================

const app_backup = (request,response) => {
    //console.log("Backup request")
      tables.backup().then( () => {
          response.json('backup done')
      })
  }

const app_backlist = (request,response) => {
//console.log("Backlist request")
    tables.backlist().then( list => 
        { response.json(list) })
    }

function app_restore(req, res) {
    tables.restore_backup(req.body.name)
    res.json("")
}

router.get('/status', app_status);
router.get('/backup', app_backup);
router.get('/backlist', app_backlist);
router.get('/:table/:key/:value', app_findby);
router.get('/:table', app_get);

router.post('/saveall', app_saveall);
router.post('/reset', app_reset);
router.post('/restore', app_restore);
router.post('/login', app_login);
router.post('/users', app_create_user);
router.post('/:table', app_add);

router.put('/:table', app_put);

router.delete('/:table/:id', app_delete);

module.exports = router;