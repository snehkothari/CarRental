const express = require('express');
const router = express.Router();

const BooksController = require('../controllers/books');

//Gets entire details of the booking
router.get('/',BooksController.books_get_all);

//Adding a booking to the database
router.post('/',BooksController.add_bookings);

//Get a particular booking based on the bookingid
router.get("/:bookId",BooksController.get_single_booking);

//Delete a booking based on its bookingid
router.delete("/:bookId",BooksController.delete_booking);

module.exports = router;
