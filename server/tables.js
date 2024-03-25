module.exports.load_table = load_table
module.exports.load_file = load_file
module.exports.save_table = save_table
module.exports.save_all_tables = save_all_tables
module.exports.get_table = get_table
module.exports.get_status = get_status
module.exports.update_item = update_item
module.exports.add_item = add_item
module.exports.delete_item = delete_item
module.exports.findby = findby
module.exports.reset_tables = reset_tables
module.exports.backup = backup
module.exports.backlist = backlist
module.exports.restore_backup = restore_backup

const fs    = require('fs');
const tar = require('tar');
const util    = require('util');

var TABLES = {}
var DIRTY = {}
var STATUS = false
var SITENAME = 'local'

var FILEPATH = 'uploads/'

const preaddir = util.promisify(fs.readdir)
const pstat = util.promisify(fs.lstat)
const preadlink = util.promisify(fs.readlink)

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

async function load_file(table) {
    var TABLE = JSON.parse(load_config(FILEPATH+'config/'+table+'.json'))
    return TABLE
}

function save_table(table,data) {
    save_config(`${FILEPATH}config/${table}.json`,JSON.stringify(data))
}

function get_status() {
    STATUS = []
    for( var table of Object.keys(TABLES)) {
        var stat = fs.lstatSync(`${FILEPATH}config/${table}.json`) 
        STATUS.push( { name: table, count: TABLES[table].length, date: stat.mtime, dirty: DIRTY[table] })
    }
    return STATUS
}

function get_table(table) {
    if (!TABLES[table]) load_table(table)
    return TABLES[table]
}

function save_all_tables() {
    for( var table of Object.keys(TABLES)) {
        console.log("Saving table ",table," ",DIRTY[table])
        if (DIRTY[table]) save_table(table,TABLES[table])
    }
    TABLES = {}
    DIRTY = {}
}

function reset_tables() {
    TABLES = {}
    DIRTY = {}
}

function update_item(table,data) {
    var target = TABLES[table]
    for( var key in target) {
        if (target[key].id === data.id) target[key] = data
    }
    DIRTY[table] = true
    return TABLES[table]
}

function add_item(table,data) { 
    var max = 0
    if (!TABLES[table]) { init_table(table,[]) }
    for ( var item of TABLES[table]) { if (max < item.id) max = item.id }
    data.id = max+1
    var newtab = TABLES[table].concat(data)
    TABLES[table] = newtab
    DIRTY[table] = true
    return data
}

function delete_item(table,cid) {
    var id = parseInt(cid)
    var newtab = TABLES[table].filter(el => el.id !== id)
    TABLES[table] = newtab
    DIRTY[table] = true
    return newtab
}

function findby(table,key,value) {
    var list = get_table(table)
    if (value == 0) return list
    list  = list.filter(item => item[key] == value);
    return list
}

function init_table(table,TABLE) {
    TABLES[table] = TABLE
    DIRTY[table] = false
}

function load_table(table) {
    var TABLE = load_config(FILEPATH+'config/'+table+'.json')
    if (!STATUS) return false
    init_table(table,JSON.parse(TABLE))
    return TABLE
}

async  function readdir(path) {
    var newfiles = [];
    files = await preaddir(path)
    for (file of files) { 
        stat = await pstat(path+'/'+file) 
        if (stat.isSymbolicLink())
          target = await preadlink(path+'/'+file)  
        else
          target = null
          //console.log("statfile ",path,file,target,stat.isSymbolicLink())
        newfiles.push({ name: file, size: stat.size, date: stat.mtime, directory: stat.isDirectory(), links: stat.nlink, target: target });
        }
    return(newfiles)
    }
  
  const zeroPad = (num, places) => String(num).padStart(places, '0')
  
  async function backup() {
    try {
      var date = new Date(Date.now())
      var month = date.getMonth()+1
      month = zeroPad(month,2)
      var day = date.getDate()
      day = zeroPad(day,2)
      var year = date.getFullYear()-2000
      var filename = 'config-'+SITENAME+'.'+year+month.toString()+day
      var cwd = 'uploads'
      var namelist = []
      var filelist = await readdir(FILEPATH+'config')
      try { fs.mkdirSync(FILEPATH+'backup') } catch(err)  { } 
      for ( file of filelist) { if ( file.name.indexOf('json')  > 0)  namelist.push('config/'+file.name) }
      //console.log("backup cwd ",cwd, filelist, namelist)
      await tar.c(  
        {
          gzip: true,
          file: FILEPATH+'backup/'+filename+'.tgz',   
          cwd: cwd
        },namelist
        )
    }  catch(err)  { console.log(err) } 
  }

  async function backlist() {
    var filelist = await readdir(FILEPATH+'backup')
    return(filelist)
  }

  async function restore_backup(file) {
    //console.log("Restoring ",file)
    restore('backup',file.name)
    return("Success")
  }

  async function restore(filepath,filename) {
    try { fs.mkdirSync(FILEPATH) } catch(err)  { } 
    try { fs.mkdirSync(FILEPATH+'config') } catch(err)  { } 
    if (!filename.includes(".tgz")) return({ msg: "Error", err: "File format" })
    try {
      var filetype = filename.split('-')[0]
      var cwd = 'uploads'
      console.log("installing path: ",filepath,"filetype: ",filetype," filename: ",filename," cwd: ",cwd)
      
      await tar.x(  
        {
          file: 'uploads/'+filepath+'/'+filename,     
          cwd: cwd
        }).catch((e) => { error = e })   
        console.log("Installed ",filename)
    }  catch(err)  {"Install err ",err } 
  }