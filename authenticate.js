var passport = require('passport');
var Userr = require('./models/user');
var passverri = require('./models/passveri')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config.js');





//Get Token
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 604800

    });
};


//check token
exports.checkToken = ((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            success: false,
            message: 'Authorization token is not supplied'
        });
    }
});



exports.ResetPassword = ((req, res, next) => {
    // console.error(req.body.email);
    let passt = passverri.findOne({
        email: req.body.email,
    })
    if (passt.resetPasswordToken = req.body.resetpassword) {
        const Password = req.body.resetpassword
    //     Userr.findOneAndUpdate({
    //         // var bok = {
    //         username: req.body.username,
    //         email: req.body.email,
    //         password: Password,
    //     }).then(use => {
    //         console.log('fff')
    //         res.json(use)
    //     })
    // } else {
    //     res.send('Your token is not valid')
    // }


Userr.findOneAndUpdate({username: req.body.username}, 
            {$set:
                {username: req.body.username, 
                    // password:  bcrypt.hash(Userr.password, 10),
                password: Password,
                email: req.body.email}}, 
                {new: true}, 
                (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
            
                console.log(doc);
                res.send(doc)
            });
        }
        // else {
        //         res.send('Your token is not valid')
        //     }
        
        // console.log(req.body.email);
    
    //     jwt.verify(token, config.secretKey, (err, decoded) => {
    //         if (err) {
    //             res.statusCode = 401;
    //             res.setHeader('Content-Type', 'application/json');
    //             return res.json({
    //                 success: false,
    //                 message: 'Token is not valid'
    //             });
    //         } else {
    //             req.decoded = decoded;
    //             next();
    //         }
    //     });
    // } else {
    //     res.statusCode = 401;
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.json({
    //         success: false,
    //         message: 'Authorization token is not supplied'
    //     });
    // }
});


























// expiresIn: 3600
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = config.secretKey;

// exports.jwtPassport = passport.use(new JwtStrategy(opts,
//     (jwt_payload, done) => {
//         console.log("JWT payload: ", jwt_payload);
//         User.findOne({
//             _id: jwt_payload._id
//         }, (err, user) => {
//             if (err) {
//                 err.message('Please provide valid token')
//                 // return done(err, false);
//             } else if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
//         });
//     }));


// exports.verifyUser = passport.authenticate('jwt', {
//     session: false
// });

// module.exports = {
//     checkToken: checkToken
// }