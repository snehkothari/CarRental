const express = require('express');
const router = express.Router();

const CarController = require('../controllers/cars');


router.post('/',CarController.add_car );

router.get('/:filter&:value',CarController.filter_car);

router.get('/',CarController.get_all_cars);
router.patch('/:carId',CarController.update_car);

router.delete('/:carId',CarController.delete_car);
module.exports = router;