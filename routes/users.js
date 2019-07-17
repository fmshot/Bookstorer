var express = require('express');
const bodyParser = require('body-parser')
var User = require('../models/user');
var Userr = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
// var middleware = require('../middleware');
var router = express.Router();
router.use(bodyParser.json());



var user_controller = require('../controllers/userController');




/* GET users listing. */
router.get('/', authenticate.checkToken, user_controller.allUsers);


//Post Request for Signup
router.post('/signup', user_controller.signUp);


//Post Request for Login
router.post('/login', user_controller.login);

//Get Request for getting All Users
router.get('/allusers', authenticate.checkToken, user_controller.allUsers);

router.post('/edit_users', 
// authenticate.checkToken, 
user_controller.edit_users);


router.post('/edit_a_user/:id', authenticate.checkToken, user_controller.edit_a_user);

router.post('/forgotpassword', user_controller.forgotpassword);













































router.get('/logout', authenticate.checkToken, user_controller.logout);



//  router.post('/ResetPassword',
// //  authenticate.checkToken, 
//  authenticate.ResetPassword);

module.exports = router;








// router.post('/cp/:id', authenticate.checkToken, user_controller.edit_user);