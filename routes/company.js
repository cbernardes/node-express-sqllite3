var express = require('express');
var { getCompanyDetails, getCompanyById } = require('../controllers/company');
var { checkIDInput } = require('../middleware');
var router = express.Router();



router.get('/', function(req, res){
    //console.log('Getting all swsCompanys');
    getCompanyDetails(req.query).then(resp => {
        res.status(200).json(resp);
    }).catch((err)=>{
        console.log({err});
        res.status(400).json(err);
    });
});


router.get('/:id', [checkIDInput], function(req, res){
    //console.log('Get swsCompany by id');
    getCompanyById({id: req.params.id}).then(resp => {
        res.status(resp ? 200 : 404).json(resp);
    }).catch((err)=>{
        console.log({err});
        res.status(400).json(err);
    });
});


module.exports = router;