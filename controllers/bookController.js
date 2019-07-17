var Book = require('../models/book');
var authenticate = require('../authenticate');
var ObjectId = require('mongoose').Types.ObjectId;


const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

var async = require('async');






exports.index = function (req, res) {

    async.parallel({
        book_count: function (callback) {
            Book.count(callback);
        },
    }, function (err, results) {
        // This is to send back raw data
        res.send(results);
        // This is to return the full HTML page designed with PUG in views
        // res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};



// Display list of all Books.
exports.books_list = ('/', (req, res) => {
    Book.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.status(400);
            res.json({
                error: err
            })
            console.log('Error in Retriving Details :' + JSON.stringify(err, undefined, 2));
        }
    });
});



//Get a specific book by Id
exports.book_unit = ((req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: `No record with the id : ${req.params.id}`
        });
    Book.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('Error in Retriving Required Book :' + JSON.stringify(err, undefined, 2));
        }
    });
});



exports.newbook_create = (async (req, res, next) => {
    console.log('request recieved', req);
    let bookk = await Book.findOne({
        title: req.body.title
    });
    if (bookk) {
        return res.status(400).send({
            message: 'That book already exists! Please change book title'
        });
    }
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn
    });
    book.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400);
            res.json({
                error: err
            })
            // res.send('Error in saving book :' + JSON.stringify(err));
            // res.send('Error in saving book :' + err);
        }
    });
});



// Edit a specific Book.
exports.edit_book_unit = ((req, res) => {
    // if (!ObjectId.isValid(req.params.id))
    //     return res.status(400).send({
    //         message: `No records with given id : ${req.params.id}`
    //     });

Book.findOneAndUpdate({isbn: req.body.isbn}, 
    {$set:
        // var bok = {
            {
                // title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn}}, {new: true}, (err, doc) => {
                if (err) {
                    res.json({
                        error:err 
                    })
                }
                console.log(doc);
                res.send(doc);
            });


 
        // };

        // Book.findByIdAndUpdate(req.params.id, { $set: bok }, { new: true}, (err, doc) => {
        //     if (!err) { res.send(doc); }
        //     else { console.log('Error in Registration Update :' + JSON.stringify(err, undefined, 2)); }
        // });
});

// router.put('/:id', (req, res) => {
//     if (!ObjectId.isValid(req.params.id))
//        return res.status(400).send(`No records with given id : ${req.params.id}`);

//        var reg = {
//            firstname: req.body.firstname,
//            lastname: req.body.lastname,
//            email: req.body.email,
//            password: '123456',
//            phonenumber: req.body.phonenumber,
//            status: '0'

//        };
//        Registration.findByIdAndUpdate(req.params.id, { $set: reg }, { new: true}, (err, doc) => {
//            if (!err) { res.send(doc); }
//            else { console.log('Error in Registration Update :' + JSON.stringify(err, undefined, 2)); }
//        });
// });




// Delete a specific Book.
exports.book_delete_post = ((req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send({
            message: `No record with given id : ${req.params.id}`
        });
    Book.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            res.status(400);
            res.json({
                error: err
            })
            // console.log('Error in Book Delete :' + JSON.stringify(err, undefined, 2));
        }
    });
});
















// // Add a new book to the collection.
// exports.newbook_create_post = ((req, res, next) => {
//     console.log('request recieved', req);
//     var book = new Book({
//         title: req.params.title,
//         author: req.params.author,
//         summary: req.params.summary,
//         isbn: req.params.isbn
//     })
//     book.save((err, result) => {
//         if (err) {
//             return next(err);
//         }
//         // Successful - redirect to new book record.
//         //    res.redirect(book.url);
//         res.send(result);
//     });
// });