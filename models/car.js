const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	vehicle_no: { type:String, required: true},
	rent: { type:Number, required: true},
	model: { type:String, required: true},
	seat_capacity: { type:Number, required: true},
	bookings:{type:Array, default:[]}
});


module.exports = mongoose.model('Car',carSchema);