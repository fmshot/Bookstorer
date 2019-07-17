var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
// var middleware = require('../middleware');

// Require controller modules.
var book_controller = require('../controllers/bookController');




                            /// BOOK ROUTES ///



//u can also call this authenticate function which doesn't use passport
// router.get('/', function(req, res, next) {
//     authenticate.checkAuthorizationToken(req, res, next)}, book_controller.index);



// GET catalog home page(Total Number of Books in Collection).
router.get('/', authenticate.checkToken, book_controller.index);

// GET request for list of all Book items.
router.get('/books', authenticate.checkToken, book_controller.books_list);



// POST request for creating a new Book item.

router.post('/createNew', authenticate.checkToken, book_controller.newbook_create);



// GET request for one Book.
router.get('/book/:id', authenticate.checkToken, book_controller.book_unit);



// GET request for one Book.
router.put('/book/:id', authenticate.checkToken, book_controller.edit_book_unit);




// GET request to delete Book.
router.delete('/book/:id/delete', authenticate.checkToken, book_controller.book_delete_post);



module.exports = router;