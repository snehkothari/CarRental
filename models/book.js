const mongoose = require('mongoose')

//Defining the schema of the booking, which requires properties like the car id and the dates for booking the car.
//Each booking is assigned a unique id which can be used to access bookings seperately.
const bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	car:{ type:mongoose.Schema.Types.ObjectId, ref:'Car', required:true },
	from: { type:Number, required: true},
	to: { type:Number, required: true}

});


module.exports = mongoose.model('Book',bookSchema);
