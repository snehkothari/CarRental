const mongoose = require('mongoose')

//Defining the schema of a car with car number,rent per day, model, seating space and bookings(if any).
//Booking is optional and can be left empty or not mentioned when adding a new car whereas other properties are required.
const carSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	vehicle_no: { type:String, required: true},
	rent: { type:Number, required: true},
	model: { type:String, required: true},
	seat_capacity: { type:Number, required: true},
	bookings:{type:Array, default:[]}
});


module.exports = mongoose.model('Car',carSchema);
