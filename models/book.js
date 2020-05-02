const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	car:{ type:mongoose.Schema.Types.ObjectId, ref:'Car', required:true },
	from: { type:Number, required: true},
	to: { type:Number, required: true}

});


module.exports = mongoose.model('Book',bookSchema);