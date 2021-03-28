// middleware
var checkIDInput = function (req, res, next) {  
    //console.log('Check ID input');
    if(!req.params.id) {
        //console.log('Invalid ID supplied');
        res.status(400).json('Invalid ID supplied');
    } else {
        next();
    }
};

// var checkIDExist = function (req, res, next) {  
//     //console.log('Check ID exist');
//     swsCompany.count({ where: { id: req.params.id } }).then(count => {
//         if (count != 0) {
//             next();
//         } else {
//             //console.log('swsCompany not found');
//             res.status(400).json('swsCompany not found');
//         }
//     }); 
// };


module.exports = {checkIDInput};