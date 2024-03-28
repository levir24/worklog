const jwt    = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const SECRET = process.env.SECRET || 'imononesideimontheother'
const BASEURL     = process.env.BASEURL    || '/worklog'

router.use((req, res, next) => {

    //console.log("Auth Request",req.url,req.body)
  
    req.decoded = {}
    if (req.method === 'GET') { next(); return }
    //if (req.url.startsWith(BASEURL+'/api/data/login')) { next(); return }
    if (req.url.startsWith(BASEURL+'/api/tables/login')) { next(); return }
    if (req.url.startsWith(BASEURL+'/api/config/pull')) { next(); return }
    if (req.url.startsWith('/daliapp/api/server/zonecmd')) { next(); return }

    var token = req.headers['access-token'];
  
    //console.log(token," method ",req.method)
  
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {      
            if (err) {
                return res.status(403).json([{err: err}]);  
                }
            else {
                req.decoded = decoded;   
                next();
                }
            });
        } 
    else {
        return res.status(403).json([]);
        }
  })

  module.exports = router;