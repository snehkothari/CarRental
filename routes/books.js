const express = require('express');
const router = express.Router();

const BooksController = require('../controllers/books');


router.get('/',BooksController.books_get_all);
router.post('/',BooksController.add_bookings);
router.get("/:bookId",BooksController.get_single_booking);
router.delete("/:bookId",BooksController.delete_booking);

module.exports = router;