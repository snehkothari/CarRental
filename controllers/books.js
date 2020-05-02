const Book = require('../models/book');
const Car = require('../models/car');
const mongoose = require('mongoose');

//Get details of all the bookings made from the database.
exports.books_get_all = (req, res, next)=> {
	Book.find()
	.select('car from to _id')
	.populate('car','rent seat_capacity model')
	.exec()
	.then(docs=>{
		res.status(200).json({
			count: docs.length,
			books: docs.map(doc =>{
				return{
					_id: doc._id,
					car: doc.car,
					from: doc.from,
					to:doc.to
				};
			})
		});
	})
	.catch(err=>{
	res.status(500).json({
		error: err
		});
	});
}
//Make a new booking if the booking doesn't clash with existing booking.
//If no clash/conflict then add the booking and also add the dates in the booking array of the car
exports.add_bookings=(req, res, next)=> {
	Car.findById(req.body.carId)
	.then(car =>{
		if(!car){
			return res.status(404).json({
				message: "Car not found"
			});
		}
		console.log("From car",car._id);
		for(i=0; i<car.bookings.length;i++){
			if(req.body.from==car.bookings[i] || req.body.to==car.bookings[i]){
				return res.status(404).json({
					message:"Booking cannot be done on that day"
				});
			}
		}
		i1=Number(req.body.from)
		i2=Number(req.body.to)
		console.log(i1);
		console.log(i2);
		//Logic for storing days in the booking of cars
		for(i=i1; i<=i2;i++){
			d=i%100
			m=(i/100)%100
			y=i/10000
			if(d==32 &&(m==1 || m==3 || m==5|| m==7||m==8||m==10)){
				i=i+69
			}
			else if(d==29 && m==2)
			{
				i=i+72
			}
			else if(d==30 && (m==4||m==6||m==9||m==11)){
				i=i+71
			}
			else if(m==12 && d==32){
				i=i+8869
			}
			else{}
			car.bookings.push(i)
		}
		car.save().then(()=>{
		console.log(car.bookings);
		})
		const book = new Book({
		_id: mongoose.Types.ObjectId(),
		from: req.body.from,
		to: req.body.to,
		car: req.body.carId
	});
	return book.save();
	
		})
	.then(result=>{
		console.log(result);
		res.status(201).json({
			message: 'Booking Confirmed',
			createdBooking:{
				_id: result._id,
				from: result.from,
				to: result.to,
				car: result.car
			}
		});
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}
//Get details of a single booking from its id
exports.get_single_booking = (req,res,next)=>{
	Book.findById(req.params.bookId)
	.populate('car')
	.exec()
	.then(book=>{
		if(!book){
			return res.status(404).json({
				message: 'Booking not found'
			});
		}
		res.status(200).json({
			book: book
		});
	})
	.catch(err=>{
		res.status(500).json({
			error: err
		});
	});
}
//Delete booking by using the booking_id
exports.delete_booking = (req,res,next)=>{
	Book.remove({_id: req.params.bookId}).exec()
	.then(result=>{
		res.status(200).json({
			message:'Booking Deleted'
		});
	})
	.catch(err=>{
		res.status(500).json({
			error: err
		});
	});
}
