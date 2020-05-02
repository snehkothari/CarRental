const express = require('express');
const router = express.Router();

const CarController = require('../controllers/cars');

//Adding a car to the database
router.post('/',CarController.add_car );

//Applying filters and displaying cars that meet the criteria
router.get('/:filter&:value',CarController.filter_car);

//Get all the car details present in the database
router.get('/',CarController.get_all_cars);

//Update details of car which are not booked(booked currently or for future)
router.patch('/:carId',CarController.update_car);

//Delete cars which are not booked (booked currently or for future)
router.delete('/:carId',CarController.delete_car);
module.exports = router;
