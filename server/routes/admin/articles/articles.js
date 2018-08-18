var express = require('express')
var router = express.Router()
    const knex = require("../../../dbClients/connection");

router.get('/', (req, res, next) => {
  
  const getData=()=>knex.select().from("languages");
  res.json(getData())
 
})
 
module.exports = router
