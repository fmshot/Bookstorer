var Userr = require('../models/user');
var passverri = require('../models/passveri')
var passport = require('passport');
var authenticate = require('../authenticate');
var ObjectId = require('mongoose').Types.ObjectId;
// import crypto from 'crypto';
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');






exports.login = (async (req, res) => {
    let user = await Userr.findOne({
        username: req.body.username
    }).then((user) => {
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
                // var token=jwt.sign({userId:user.id},key.tokenKey);
                var token = authenticate.getToken({
                    _id: req.body._id
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    success: true,
                    token: token,
                    status: 'You are successfully logged in!'
                });
            } else {
                res.status(400).json({
                    message: 'Invalid Password/Username',
                    error:err
                });
            }
        })
    }).catch((err) => {
        res.status(400).json({
            message: 'Invalid Password/Username'
        });
    })
})



//User Sign-up Controller
exports.signUp = (async (req, res) => {
    console.log('request recieved', req);
    // Check if this user already exisits
    let user = await Userr.findOne({
        username: req.body.username
    });
    if (user) {
        return res.status(400).send({
            message: 'That user already exists!'
        });
    }

    let user2 = await Userr.findOne({
        email: req.body.email
    });
    if (user2) {
        return res.status(400).send({
            message: 'That email already exists!'
        });
    }
    
    var userr = new Userr({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    userr.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400);
            res.json({
                error: err
            })
            // console.log('Error in Registration save :' + JSON.stringify(err, undefined, 2));
        }
    });

    let user4Pass =  await passverri.findOne({
        email: req.body.email
    });
    if (user4Pass) {
        // return res.status(400).send({
        //     message: 'That user already exists!'
        // });
        console.log('pass', user4Pass)
    }else{
        var userr4pass = new passverri({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        userr4pass.save((err, doc) => {
            if (!err) {
                // res.send(doc);
                console.log('request recieved', req);

            } else {
                // res.status(400);
                // res.json({
                //     error: err
                // })
                console.log('Error in Registration save :' + JSON.stringify(err, undefined, 2));
            }
        });
    }
});

exports.allUsers = ((req, res) => {
    Userr.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in Retriving Details :' + JSON.stringify(err, undefined, 2));
        }
    });
});


exports.edit_a_user = (async(req, res) => {
    console.log('pass', req.body.password);
    let paa = req.body.password
    const hashedPasswordss = await bcrypt.hash(paa, 10);
        Userr.findOneAndUpdate({
        username: req.body.username
    }, {
        $set:
        // var bok = {
        {
            // title: req.body.title,
            username: req.body.username,
            password: hashedPasswordss,
            email: req.body.email
        }
    }, {
        new: true
    }, (err, doc) => {
        if (!err) {
            res.status(200).send({
                message: 'Your records have been updated successfully'
            });
        } else {
            res.status(400);
            res.json({
                error: err
            })
        }

    })
});




// Edit a specific Book.
exports.edit_users = ((req, res) => {
    let passt = passverri.findOne({
        email: req.body.email
    }, function (err, obj) {
        // console.log("Something wrong when updating datas!", obj.resetPasswordToken);
        console.log("Body pf password!", req.body.password);
        if (obj.resetPasswordToken !== req.body.password) {
            return res.send('Your reset Password is not valid')
           

        } else {
            Userr.findOneAndUpdate({
                    email: req.body.email
                }, {
                    $set: {
                        username: req.body.username,
                        // password: Password,
                    }
                }, {
                    new: true
                },
                (err, doc) => {
                    
                    var token = authenticate.getToken({
                        _id: req.body._id
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        token: token,
                        status: 'You are successfully logged in!'
                    });
                   
                });
        }
    })

});




// module.exports = (app) => {
exports.forgotpassword = (async (req, res) => {
    if (req.body.email === '') {
        res.status(400).json({message:'Your email is required!'});
    }
    console.error(req.body.email);
    let user = await Userr.findOne({
        email: req.body.email,
    })
    if (user === null) {
        console.error('email not in database');
        res.status(403).json({message:'Your email is not in db'});
    } else {
        const token = crypto.randomBytes(20).toString('hex');


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bookstorecatalog@gmail.com',
                pass: 'nazareneadebayo1',
            },
        });

        const mailOptions = {
            from: 'mySqlDemoEmail@gmail.com',
            to: `${user.email}`,
            subject: 'Link To Reset Password',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                `http://localhost:3031/reset/${token}\n\n` +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('there was an error: ', err);
            } else {
                console.log('here is the res: ', response);
                res.status(200).json('recovery email sent');
            }
        });



        passverri.findOneAndUpdate({
                email: req.body.email
            }, {
                $set: {
                    email: req.body.email,
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 360000,
                }
            }, {
                new: true
            },
            (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }

                console.log(doc);
                res.send(doc)
            }
        )

        // Userr.findOneAndUpdate({username: req.body.username}, 
        //     {$set:
        //         {username: req.body.username, 
        //         password: req.body.password,
        //         email: req.body.email}}, 
        //         {new: true}, 
        //         (err, doc) => {
        //         if (err) {
        //             console.log("Something wrong when updating data!");
        //         }

        //         console.log(doc);
        //         res.send(doc)
        //     });

        // let passReset = await passverri.findOne({
        //     email: req.body.email,
        // })
        // if (passReset === null) {
        //     console.error('email not in database');
        //     res.status(403).send('email not in db');


        //     var passResets = new passverri({
        //         email: req.body.email,
        //         resetPasswordToken: token,
        //         resetPasswordExpires: Date.now() + 360000,
        //     });
        //     passResets.save((err, doc) => {
        //         if (!err) {
        //             res.send(doc);
        //         } else {
        //             res.status(400);
        //             res.json({
        //                 error: err
        //             })
        //             // console.log('Error in Registration save :' + JSON.stringify(err, undefined, 2));
        //         }
        //     });



        // }


    }


});
//   };
































// exports.edit_user = ((req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//         return res.status(400).send({
//             message: `No user with given id : ${req.params.id}`
//         });

//     Userr.findByIdAndUpdate(req.params.id, {
//         $set: {
//             username: req.body.username,
//             password: bcrypt.hash(req.body.password, 10),
//             // password: Password,
//             email: req.body.email
//         }
//     }, {
//         new: true
//     }, (err, doc) => {
//         if (!err) {
//             res.status(200).send({
//                 message: 'Your records have been updated successfully'
//             });
//         } else {
//             res.status(400);
//             res.json({
//                 error: err
//             })
//             // console.log('Error in Admin Products Update :' + JSON.stringify(err, undefined, 2));
//         }
//     })
// });







exports.logout = ((req, res) => {
    // res.send('eieiei')
    res.redirect('/');

});
