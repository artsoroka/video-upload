var router = require('express').Router(); 

router.get('/login', function(req,res){
    res.send('login page'); 
}); 

router.get('/logout', function(req,res){
    res.send('logout user'); 
}); 

module.exports = router; 